import { AlgorithmType } from '../algorithm';
import { IRegressionAlgorithmJson } from '../regression-algorithm/regression-algorithm-json';

export interface ILogisticRegressionJson
    extends IRegressionAlgorithmJson<AlgorithmType.LogisticRegression> {}
