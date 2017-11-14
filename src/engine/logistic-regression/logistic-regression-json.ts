import { IAlgorithmJson, AlgorithmType } from '../algorithm';

export interface ILogisticRegressionJson extends IAlgorithmJson {
    algorithmType: AlgorithmType.LogisticRegression;
}
