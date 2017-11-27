import { Algorithm, AlgorithmType } from '../algorithm';
import { Data } from '../data';
export interface ILogisticRegression extends Algorithm {
    algorithmType: AlgorithmType.LogisticRegression;
}
export declare function getRisk(logRegAlgorithm: ILogisticRegression, data: Data): number;
