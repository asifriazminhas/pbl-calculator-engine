import { GenericMultipleAlgorithmModel } from '../generic';
import { ICoxJson } from '../../cox-json';
import { Data } from '../../data';
import { getPredicateResult } from '../multiple-algorithm-model/predicate';

export type MultipleAlgorithmModelJson = GenericMultipleAlgorithmModel<ICoxJson>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data
): ICoxJson {
    const matchedAlgorithm = multipleAlgorithmModel
        .algorithms
        .find((algorithmWithPredicate) => {
            return getPredicateResult(
                data,
                algorithmWithPredicate.predicate
            )
        });

    if(!matchedAlgorithm) {
        throw new Error(`No matched algorithm found`);
    }

    return matchedAlgorithm.algorithm;
}