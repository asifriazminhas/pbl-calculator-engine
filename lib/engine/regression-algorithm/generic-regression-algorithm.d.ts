import { IGenericAlgorithm } from '../algorithm';
import { AlgorithmType } from '../algorithm/algorithm-type';
export interface IGenericRegressionAlgorithm<T, U, V, Z extends AlgorithmType> extends IGenericAlgorithm<U, Z> {
    covariates: T[];
    baseline: number | V;
}
