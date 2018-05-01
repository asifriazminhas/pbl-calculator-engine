import { IAlgorithmJson } from '../algorithm';
import { IGenericRegressionAlgorithm } from './generic-regression-algorithm';
import { ICovariateJson } from '../../parsers/json/json-covariate';
import { AlgorithmType } from '../algorithm/algorithm-type';

export interface IRegressionAlgorithmJson<Z extends AlgorithmType>
    extends IAlgorithmJson<Z>,
        IGenericRegressionAlgorithm<ICovariateJson, string, Z> {}
