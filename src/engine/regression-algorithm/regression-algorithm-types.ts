import { Cox } from '../cox/cox';
import { ILogisticRegression } from '../logistic-regression/logistic-regression';
import { IAlgorithm } from '../algorithm/algorithm';
import { AlgorithmType } from '../algorithm/algorithm-type';

export type RegressionAlgorithmTypes = Cox | ILogisticRegression;

export function isRegressionAlgorithm(
    algorithm: IAlgorithm<any>,
): algorithm is RegressionAlgorithmTypes {
    return (
        algorithm.algorithmType === AlgorithmType.Cox ||
        algorithm.algorithmType === AlgorithmType.LogisticRegression
    );
}
