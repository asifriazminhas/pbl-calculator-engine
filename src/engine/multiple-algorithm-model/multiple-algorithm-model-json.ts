import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { ICoxJson } from '../cox';
import { Data } from '../data';
import { getPredicateResult } from './predicate';

export type MultipleAlgorithmModelJson = GenericMultipleAlgorithmModel<
    ICoxJson
>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data,
): ICoxJson {
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
