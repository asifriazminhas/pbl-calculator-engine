import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { IAlgorithmJson } from '../algorithm';
import { Data } from '../data';
import { getPredicateResult } from './predicate';

export type MultipleAlgorithmModelJson = GenericMultipleAlgorithmModel<
    IAlgorithmJson
>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data,
): IAlgorithmJson {
    const matchedAlgorithm = multipleAlgorithmModel.algorithms.find(
        algorithmWithPredicate => {
            return getPredicateResult(data, algorithmWithPredicate.predicate);
        },
    );

    if (!matchedAlgorithm) {
        throw new Error(`No matched algorithm found`);
    }

    return matchedAlgorithm.algorithm;
}
