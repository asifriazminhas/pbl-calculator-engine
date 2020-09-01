/// <reference types="lodash" />
import { Algorithm } from '../algorithm';
import { Covariate } from '../../data-field/covariate/covariate';
import { Data } from '../../data/data';
import { ICoxSurvivalAlgorithmJson } from '../../../parsers/json/json-cox-survival-algorithm';
import { DataField } from '../../data-field/data-field';
import { RiskFactor } from '../../../risk-factors';
export declare abstract class RegressionAlgorithm extends Algorithm {
    covariates: Covariate[];
    protected getAllFields: (() => DataField[]) & import("lodash").MemoizedFunction;
    constructor(regressionAlgorithmJson: ICoxSurvivalAlgorithmJson);
    calculateScore(data: Data): number;
    getCovariatesForGroup(group: RiskFactor): Covariate[];
    getCovariatesWithoutGroup(group: RiskFactor): Covariate[];
    getAllFieldsForGroup(group: RiskFactor): DataField[];
    replaceCovariate<T extends RegressionAlgorithm>(this: T, externalCovariate: {
        name: string;
        beta: number;
    }): T;
    /**
     * Goes through each datum in the data arg and does the following checks:
     * 1. Checks whether they are within the bounds defined by the interval
     * field on the corresponding DataField object. If they aren't, sets them
     * to either the lower or upper bound
     *
     * @private
     * @param {Data} data
     * @returns {Data}
     * @memberof RegressionAlgorithm
     */
    private validateData;
}
