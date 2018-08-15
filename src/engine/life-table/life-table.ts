import { Data, findDatumWithName } from '../data';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import * as moment from 'moment';
import { filterDataForFields } from '../data/data';
import { NonInteractionCovariate } from '../data-field/covariate/non-interaction-covariats/non-interaction-covariate';
import { isSameDataField } from '../data-field/data-field';
import { flatten, uniqWith } from 'lodash';
import { InteractionCovariate } from '../data-field/covariate/interaction-covariate/interaction-covariate';

export interface IRefLifeTableRow {
    age: number;
    ax: number;
    ex: number;
    qx: number;
}

export type RefLifeTable = IRefLifeTableRow[];

export interface IGenderSpecificRefLifeTable {
    male: RefLifeTable;
    female: RefLifeTable;
}

export interface ICompleteLifeTableRow extends IRefLifeTableRow {
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
    qx: number;
}

export type CompleteLifeTable = ICompleteLifeTableRow[];

export type GetPredictedRiskForAge = (age: number) => number;

/**
 * Returns lx for the passed life table row
 *
 * @param {(LifeTableRow | undefined)} lifeTableRow If undefined then it means
 * the function should return the lx for the first life table row which is by
 * default 100000
 * @returns {number}
 */
function getlxForLifeTableRow(
    lifeTableRow: ICompleteLifeTableRow | undefined,
): number {
    if (lifeTableRow === undefined) {
        return 100000;
    } else {
        return lifeTableRow.lx - lifeTableRow.dx;
    }
}

/**
 * Returns calculated value for dx from passed lx and qx arguments
 *
 * @param {number} lx
 * @param {number} qx
 * @returns {number}
 */
function getdx(lx: number, qx: number): number {
    return lx * qx;
}

/**
 * Returns calculated value for Lx from passed lx, dx and ax arguments
 *
 * @param {number} lx
 * @param {number} dx
 * @param {number} ax
 * @returns
 */
function getLx(lx: number, dx: number, ax: number) {
    return lx - dx + dx * ax;
}

/**
 * Returns calculated value of Tx
 *
 * @param {LifeTableRow} lifeTableRow The row for which we need to calculate Tx
 * @param {(LifeTableRow | undefined)} nextLifeTableRow The next row after the lifeTableRow argument.
 * @returns {number}
 */
function getTx(
    lifeTableRow: ICompleteLifeTableRow,
    nextLifeTableRow: ICompleteLifeTableRow | undefined,
): number {
    if (nextLifeTableRow === undefined) {
        return lifeTableRow.Lx;
    } else {
        return nextLifeTableRow.Tx + lifeTableRow.Lx;
    }
}

/**
 * Returns calculated value for ex
 *
 * @param {LifeTableRow} lifeTableRow The row for which we need to calculate ex
 * @param {(LifeTableRow | undefined)} nextLifeTableRow The next row after the lifeTableRow argument
 * @returns {number}
 */
function getex(
    lifeTableRow: ICompleteLifeTableRow,
    nextLifeTableRow: ICompleteLifeTableRow | undefined,
): number {
    if (nextLifeTableRow === undefined) {
        return lifeTableRow.ax;
    } else {
        // Do this to avoid returning NaN
        if (lifeTableRow.lx === 0) {
            return 0;
        } else {
            return lifeTableRow.Tx / lifeTableRow.lx;
        }
    }
}

/**
 * Creates a new life table from the baseLifeTableWithQx which has only age, qx
 * and ax terms and completes it by adding lx, dx, Lx, Tx and ex terms
 *
 * @param {Array<BaseLifeTableWithQxRow>} baseLifeTableWithQx
 * @returns {Array<LifeTableRow>}
 */
export function getCompleteLifeTableWithStartAge(
    refLifeTable: RefLifeTable,
    getPredictedRiskForAge: GetPredictedRiskForAge,
    startAge: number,
    useLifeTableForExFromAge: number = 99,
): CompleteLifeTable {
    const lifeTable: CompleteLifeTable = [];

    const refLifeTableWithQx: Array<
        IRefLifeTableRow & {
            qx: number;
        }
    > = [];

    const refLifeTableFromStartAge = refLifeTable.filter(
        refLifeTableRow => refLifeTableRow.age >= startAge,
    );

    refLifeTableFromStartAge.forEach(refLifeTableRow => {
        refLifeTableWithQx.push(
            Object.assign({}, refLifeTableRow, {
                qx:
                    refLifeTableRow.age < useLifeTableForExFromAge
                        ? getPredictedRiskForAge(refLifeTableRow.age)
                        : refLifeTableRow.qx,
            }),
        );
    });

    refLifeTableWithQx.forEach((baseLifeTableRow, index) => {
        const lx = getlxForLifeTableRow(lifeTable[index - 1]);
        const dx = getdx(lx, baseLifeTableRow.qx);
        const Lx = getLx(lx, dx, baseLifeTableRow.ax);

        lifeTable.push(
            Object.assign({}, baseLifeTableRow, {
                lx,
                dx,
                Lx,
                Tx: 0,
                ex: 0,
            }),
        );
    });

    const reversedLifeTable = refLifeTable.reverse();

    /* Reverse the lifetable since for Tx and ex we need the current row and next row */
    lifeTable.reverse().forEach((lifeTableRow, index) => {
        lifeTableRow.Tx = getTx(lifeTableRow, lifeTable[index - 1]);
        lifeTableRow.ex =
            Number(lifeTableRow.age) < useLifeTableForExFromAge
                ? getex(lifeTableRow, lifeTable[index - 1])
                : reversedLifeTable[index].ex;
    });

    refLifeTable.reverse();
    // Reverse the life table again since reverse is a mutable operation
    lifeTable.reverse();

    return lifeTable;
}

export function getCompleteLifeTableForDataUsingAlgorithm(
    refLifeTable: RefLifeTable,
    data: Data,
    cox: CoxSurvivalAlgorithm,
    useExFromLifeTableFromAge: number = 99,
    getPredictedRiskForAge?: (age: number) => number,
): CompleteLifeTable {
    const ageInteractionCovariates = cox.covariates.filter(covariate => {
        return (
            covariate instanceof InteractionCovariate &&
            covariate.isPartOfGroup('AGE')
        );
    });
    const ageNonInteractionCovariates = cox.covariates.filter(covariate => {
        return (
            covariate instanceof NonInteractionCovariate &&
            covariate.isPartOfGroup('AGE')
        );
    });
    const allAgeFields = uniqWith(
        flatten(
            ageNonInteractionCovariates
                .map(covariate => {
                    return covariate.getAllChildFields();
                })
                .concat(ageInteractionCovariates)
                .concat(ageNonInteractionCovariates),
        ),
        isSameDataField,
    );

    const dataWithoutAgeFields = filterDataForFields(data, allAgeFields);
    const ageDatum = findDatumWithName('age', data);
    /* When we go through each row of the life table and calculate ex, the only
    coefficient that changes going from one covariate to the next are the ones
    belonging to the age covariate since we increment the age value from one
    row of the life table to the next. As an optimization we precalculate the
    coefficients for all covariates that are not part of the age group and add
    them to the data which will be used to calculate the life table */
    const lifeTableDataWithoutAge = filterDataForFields(
        cox
            .getCovariatesWithoutGroup('AGE')
            /* Goes through all non-age covariates and calculates the data
            required to calculate the coefficient for each one. Then uses the
            data to calculate the actual coefficient and finally adds it all
            to the currentData argument to be used by the next covariate */
            .reduce((currentData, covariate) => {
                const currentCoefficientData = covariate.calculateDataToCalculateCoefficent(
                    currentData,
                    cox.userFunctions,
                    cox.tables,
                );
                const covariateCoefficient = {
                    name: covariate.name,
                    coefficent: covariate.calculateCoefficient(
                        currentCoefficientData,
                        cox.userFunctions,
                        cox.tables,
                    ),
                };

                return currentData
                    .concat(currentCoefficientData)
                    .concat([covariateCoefficient]);
            }, dataWithoutAgeFields.concat(ageDatum)),
        allAgeFields,
    );

    return getCompleteLifeTableWithStartAge(
        refLifeTable,
        age => {
            if (getPredictedRiskForAge) {
                return getPredictedRiskForAge(age);
            } else {
                const now = moment();
                now.add(1, 'year');

                return cox.getRiskToTime(
                    lifeTableDataWithoutAge.concat({
                        name: 'age',
                        coefficent: age,
                    }),
                    now,
                );
            }
        },
        ageDatum.coefficent as number,
        useExFromLifeTableFromAge,
    );
}
