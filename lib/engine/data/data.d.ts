import { IDatum } from './datum';
import { DataField } from '../data-field/data-field';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { RiskFactor } from '../../risk-factors';
export declare type Data = IDatum[];
export declare function updateDataWithData(data: Data, dataUpdate: Data): Data;
/**
 * Returns the IDatum object whose name field is the same as the name argument.
 * Throws a NoDatumFoundError if no IDatum object is found
 *
 * @export
 * @param {string} name
 * @param {Data} data
 * @returns {IDatum}
 */
export declare function findDatumWithName(name: string, data: Data): IDatum;
export declare function updateDataWithDatum(data: Data, datumUpdate: IDatum): Data;
export declare function isEqual(dataOne: Data, dataTwo: Data): boolean;
export declare function filterDataForFields(data: Data, dataFields: DataField[]): Data;
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
export declare function filterDataUsedToCalculateCoefficientsForCovariateGroup(covariateGroup: RiskFactor, cox: CoxSurvivalAlgorithm, data: Data): Data;
