import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

export abstract class CoxFactory {
    static extendCox<T extends object>(
        cox: CoxSurvivalAlgorithm,
        additionalProperties: T,
    ): CoxSurvivalAlgorithm & T {
        return Object.setPrototypeOf(
            Object.assign({}, cox, additionalProperties),
            CoxSurvivalAlgorithm.prototype,
        );
    }
}
