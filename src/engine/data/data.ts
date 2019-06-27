import { IDatum } from './datum';
import { throwErrorIfUndefined } from '../../util/undefined/undefined';
import { NoDatumFoundError } from '../errors';
import { DataField } from '../data-field/data-field';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { RiskFactor } from '../../risk-factors';

export type Data = IDatum[];

export function updateDataWithData(data: Data, dataUpdate: Data): Data {
    return data
        .filter(datum => {
            return dataUpdate.find((datumForRiskFactor: any) => {
                return datumForRiskFactor.name === datum.name;
            })
                ? false
                : true;
        })
        .concat(dataUpdate);
}

/**
 * Returns the IDatum object whose name field is the same as the name argument.
 * Throws a NoDatumFoundError if no IDatum object is found
 *
 * @export
 * @param {string} name
 * @param {Data} data
 * @returns {IDatum}
 */
export function findDatumWithName(name: string, data: Data): IDatum {
    return throwErrorIfUndefined(
        data.find(datum => datum.name === name),
        new NoDatumFoundError(name),
    );
}

export function updateDataWithDatum(data: Data, datumUpdate: IDatum): Data {
    return updateDataWithData(data, [datumUpdate]);
}

export function isEqual(dataOne: Data, dataTwo: Data): boolean {
    if (dataOne.length !== dataTwo.length) {
        return false;
    }

    return dataOne.find(dataOneDatum => {
        const equivalentDataTwoDatumForCurrentDateOneDatum = dataTwo.find(
            dataTwoDatum => dataTwoDatum.name === dataOneDatum.name,
        );

        if (!equivalentDataTwoDatumForCurrentDateOneDatum) {
            return true;
        }

        return !(
            equivalentDataTwoDatumForCurrentDateOneDatum.coefficent ===
            dataOneDatum.coefficent
        );
    })
        ? false
        : true;
}

export function filterDataForFields(data: Data, dataFields: DataField[]): Data {
    const dataFieldNames = dataFields.map(dataField => {
        return dataField.name;
    });

    return data.filter(datum => {
        return dataFieldNames.indexOf(datum.name) === -1;
    });
}

/**
 * Removes all datum from the data arg that can be used to calculate the
 * coefficient for the covariates in the group specified in the covariateGroup
 * arg. For example, if covariateGroup is 'AGE' and one of the datum is 'age',
 * it would be removed from the data argument
 *
 * @export
 * @param {CovariateGroup} covariateGroup
 * @param {CoxSurvivalAlgorithm} cox
 * @param {Data} data
 * @returns {Data}
 */
export function filterDataUsedToCalculateCoefficientsForCovariateGroup(
    covariateGroup: RiskFactor,
    cox: CoxSurvivalAlgorithm,
    data: Data,
): Data {
    return filterDataForFields(data, cox.getAllFieldsForGroup(covariateGroup));
}
