import {
    Algorithm,
    AlgorithmType,
    calculateScore,
    getBaselineHazardForData,
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
        getBaselineHazardForData(logRegAlgorithm, data) +
        calculateScore(logRegAlgorithm, data);
    const elogit = Math.exp(logit);

    return elogit / (1 + elogit);
}
