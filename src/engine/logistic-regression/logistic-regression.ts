import { AlgorithmType } from '../algorithm';
import { Data } from '../data';
import {
    calculateScore,
    IRegressionAlgorithm,
    getBaselineForData,
} from '../regression-algorithm/regression-algorithm';

export interface ILogisticRegression
    extends IRegressionAlgorithm<AlgorithmType.LogisticRegression> {
    algorithmType: AlgorithmType.LogisticRegression;
}

export function getRisk(
    logRegAlgorithm: ILogisticRegression,
    data: Data,
): number {
    const logit =
        getBaselineForData(logRegAlgorithm, data) +
        calculateScore(logRegAlgorithm, data);
    const elogit = Math.exp(logit);

    return elogit / (1 + elogit);
}
