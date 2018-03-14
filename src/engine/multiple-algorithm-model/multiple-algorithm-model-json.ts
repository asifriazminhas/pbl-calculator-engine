import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { IAlgorithmJson } from '../algorithm';
import { Data } from '../data';
import { getFirstTruePredicateObject } from './predicate/predicate';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';
import { NoPredicateObjectFoundError } from './predicate/predicate-errors';

export type MultipleAlgorithmModelJson<
    U extends AlgorithmJsonTypes = AlgorithmJsonTypes
> = GenericMultipleAlgorithmModel<U>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data,
): IAlgorithmJson<any> {
    try {
        return getFirstTruePredicateObject(
            multipleAlgorithmModel.algorithms,
            data,
        ).algorithm;
    } catch (err) {
        if (err instanceof NoPredicateObjectFoundError) {
            throw new Error(`No matched algorithm found`);
        } else {
            throw err;
        }
    }
}
