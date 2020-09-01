import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
export declare abstract class CoxFactory {
    static extendCox<T extends object>(cox: CoxSurvivalAlgorithm, additionalProperties: T): CoxSurvivalAlgorithm & T;
}
