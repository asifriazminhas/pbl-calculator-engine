import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Data } from '../data';
import { getFirstTruePredicateObject } from './predicate/predicate';
import { NoPredicateObjectFoundError } from './predicate/predicate-errors';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';

export type MultipleAlgorithmModelJson = GenericMultipleAlgorithmModel<
    ICoxSurvivalAlgorithmJson
>;

export function getAlgorithmJsonForData(
    multipleAlgorithmModel: MultipleAlgorithmModelJson,
    data: Data,
): ICoxSurvivalAlgorithmJson {
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
