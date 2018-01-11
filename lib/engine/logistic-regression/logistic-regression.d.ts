import { AlgorithmType } from '../algorithm';
import { Data } from '../data';
import { IRegressionAlgorithm } from '../regression-algorithm/regression-algorithm';
export interface ILogisticRegression extends IRegressionAlgorithm<AlgorithmType.LogisticRegression> {
    algorithmType: AlgorithmType.LogisticRegression;
}
export declare function getRisk(logRegAlgorithm: ILogisticRegression, data: Data): number;
