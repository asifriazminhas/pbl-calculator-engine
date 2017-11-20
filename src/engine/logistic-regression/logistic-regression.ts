import {
    Algorithm,
    AlgorithmType,
    calculateScore,
    getBaselineForData,
} from '../algorithm';
import { Data } from '../data';

export interface ILogisticRegression extends Algorithm {
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
