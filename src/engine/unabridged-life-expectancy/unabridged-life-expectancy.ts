import { Model, Data } from '../model';
import {
    IGenderedUnAbridgedLifeTable,
    IUnAbridgedLifeTableRow,
} from './unabridged-life-table';
import {
    LifeExpectancy,
    ICompleteLifeTableRow,
} from '../life-expectancy/life-expectancy';
import { InteractionCovariate } from '../data-field/covariate/interaction-covariate/interaction-covariate';
import { NonInteractionCovariate } from '../data-field/covariate/non-interaction-covariats/non-interaction-covariate';
import { DataField } from '../data-field/data-field';
import { flatten } from 'lodash';
import { filterDataForFields } from '../data/data';
import { findDatumWithName } from '../data';

export class UnAbridgedLifeExpectancy extends LifeExpectancy<
    IUnAbridgedLifeTableRow
> {
    private genderedUnAbridgedLifeTable: IGenderedUnAbridgedLifeTable;

    constructor(
        model: Model,
        genderedUnAbridgedLifeTable: IGenderedUnAbridgedLifeTable,
    ) {
        super(model);

        this.model = model;
        this.genderedUnAbridgedLifeTable = genderedUnAbridgedLifeTable;
    }

    /**
     * Calculates the life expectancy for an individual using a un-abridged
     * life table
     *
     * @param {Data} data The variables and their values for this individual
     * @returns {number}
     * @memberof UnABridgedLifeExpectancy
     */
    calculateForIndividual(data: Data): number {
        const algorithm = this.model.getAlgorithmForData(data);

        // For an algorithm which has binning data we don't need to use the
        // life table
        if ('bins' in algorithm && algorithm.bins !== undefined) {
            // Ge the bin data for the bin this individual is in
            const binData = algorithm.bins!.getBinDataForScore(
                algorithm.calculateScore(data),
            );

            // Get the survival time for the median survival value (50) for
            // this bin
            const MedianSurvival = 50;
            return binData.find(binDatum => {
                return binDatum.survivalPercent === MedianSurvival;
            })!.time as number;
        } else {
            const AgeDatumName = 'age';
            const ageDatum = findDatumWithName(AgeDatumName, data);

            const ageInteractionCovariates = algorithm.covariates.filter(
                covariate => {
                    return (
                        covariate instanceof InteractionCovariate &&
                        covariate.isPartOfGroup('AGE')
                    );
                },
            );
            const ageNonInteractionCovariates = algorithm.covariates.filter(
                covariate => {
                    return (
                        covariate instanceof NonInteractionCovariate &&
                        covariate.isPartOfGroup('AGE')
                    );
                },
            );
            const allAgeFields = DataField.getUniqueDataFields(
                flatten(
                    ageNonInteractionCovariates
                        .map(covariate => {
                            return covariate.getDescendantFields();
                        })
                        .concat(ageInteractionCovariates)
                        .concat(ageNonInteractionCovariates),
                ),
            );
            const dataWithoutAgeFields = filterDataForFields(
                data,
                allAgeFields,
            );
            /* When we go through each row of the life table and calculate ex, the only
            coefficient that changes going from one covariate to the next are the ones
            belonging to the age covariate since we increment the age value from one
            row of the life table to the next. As an optimization we precalculate the
            coefficients for all covariates that are not part of the age group and use it as the base data for
            calculating qx for each life table row*/
            const lifeTableDataWithoutAge = filterDataForFields(
                algorithm
                    .getCovariatesWithoutGroup('AGE')
                    /* Goes through all non-age covariates and calculates the data
                    required to calculate the coefficient for each one. Then uses the
                    data to calculate the actual coefficient and finally adds it all
                    to the currentData argument to be used by the next covariate */
                    .reduce((currentData, covariate) => {
                        const currentCoefficientData = covariate.calculateDataToCalculateCoefficent(
                            currentData,
                            algorithm.userFunctions,
                            algorithm.tables,
                        );
                        const covariateCoefficient = {
                            name: covariate.name,
                            coefficent: covariate.calculateCoefficient(
                                currentCoefficientData,
                                algorithm.userFunctions,
                                algorithm.tables,
                            ),
                        };

                        return currentData
                            .concat(currentCoefficientData)
                            .concat([covariateCoefficient]);
                    }, dataWithoutAgeFields.concat(ageDatum)),
                allAgeFields,
            );

            const SexDatumName = 'sex';
            const unAbridgedLifeTable = this.genderedUnAbridgedLifeTable[
                findDatumWithName(SexDatumName, data).coefficent as
                    | 'male'
                    | 'female'
            ];
            // The partial life table we will
            const refLifeTableWithQxAndNx = unAbridgedLifeTable.map(
                lifeTableRow => {
                    return Object.assign({}, lifeTableRow, {
                        qx: this.getQx(
                            lifeTableDataWithoutAge.concat({
                                name: AgeDatumName,
                                coefficent: lifeTableRow.age,
                            }),
                        ),
                        nx: 1,
                    });
                },
            );
            const ageMaxAllowableValue = algorithm.findDataField(AgeDatumName)
                .interval!.higherMargin!.margin;
            // Get the index of the life table row after which we need to
            // stop calculating values
            const lastValidLifeTableRowIndex = unAbridgedLifeTable.findIndex(
                lifeTableRow => {
                    return lifeTableRow.age > ageMaxAllowableValue;
                },
            );

            const completeLifeTable = this.getCompleteLifeTable(
                refLifeTableWithQxAndNx,
                unAbridgedLifeTable[lastValidLifeTableRowIndex].age,
                [
                    unAbridgedLifeTable[lastValidLifeTableRowIndex].age,
                    unAbridgedLifeTable[lastValidLifeTableRowIndex - 1].age,
                ],
            );

            return this.getLifeExpectancyForAge(
                completeLifeTable,
                ageDatum.coefficent as number,
            );
        }
    }

    protected getLifeTableRowForAge(
        completeLifeTable: Array<
            IUnAbridgedLifeTableRow & ICompleteLifeTableRow
        >,
        age: number,
    ) {
        return completeLifeTable.find(lifeTableRow => {
            return lifeTableRow.age === age;
        });
    }
}
