import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { Predicate } from '../predicate/predicate';
export declare class ModelAlgorithm {
    algorithm: CoxSurvivalAlgorithm;
    predicate: Predicate;
    constructor(algorithm: CoxSurvivalAlgorithm, predicate: Predicate);
}
