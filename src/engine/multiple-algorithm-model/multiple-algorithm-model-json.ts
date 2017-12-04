import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { IAlgorithmJson } from '../algorithm';
import { Data } from '../data';
import { getPredicateResult } from './predicate';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';

export type MultipleAlgorithmModelJson<
    U extends AlgorithmJsonTypes = AlgorithmJsonTypes
> = GenericMultipleAlgorithmModel<U>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data,
): IAlgorithmJson<any> {
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
