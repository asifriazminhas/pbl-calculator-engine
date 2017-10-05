import { GenericMultipleAlgorithmModel } from '../generic';
import { CoxJson } from '../../common/json-types';
import { Data } from '../../common/data';
import { getPredicateResult } from '../multiple-algorithm-model/predicate';

export type MultipleAlgorithmModelJson = GenericMultipleAlgorithmModel<CoxJson>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data
): CoxJson {
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