import { GenericMultipleAlgorithmModel } from '../generic';
import { Cox } from '../../cox';
import { Data } from '../../common/data';
import { getPredicateResult } from './predicate';

export type MultipleAlgorithmModel = GenericMultipleAlgorithmModel<Cox>;

export function getAlgorithmForData(
    multipleAlgorithmModel: MultipleAlgorithmModel,
    data: Data
): Cox {
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