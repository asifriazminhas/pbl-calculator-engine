import { IAlgorithmJson } from '../algorithm';
import { IGenericRegressionAlgorithm } from './generic-regression-algorithm';
import { CovariateJson } from '../covariate';
import { AlgorithmType } from '../algorithm/algorithm-type';

export interface IRegressionAlgorithmJson<Z extends AlgorithmType>
    extends IAlgorithmJson<Z>,
        IGenericRegressionAlgorithm<CovariateJson, string, Z> {}
