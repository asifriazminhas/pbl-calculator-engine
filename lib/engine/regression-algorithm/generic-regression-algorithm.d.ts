import { IGenericAlgorithm } from '../algorithm';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { IBaselineMixin } from './baseline/baseline';
export interface IGenericRegressionAlgorithm<T, U, Z extends AlgorithmType> extends IGenericAlgorithm<U, Z>, IBaselineMixin {
    covariates: T[];
}
