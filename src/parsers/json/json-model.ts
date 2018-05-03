import { Model } from '../../engine/model/model';
import { Jsonify } from '../../util/types';
import { Omit } from 'utility-types';
import { ICoxSurvivalAlgorithmJson } from './json-cox-survival-algorithm';
import { PredicateJson } from './json-predicate';
import { Data } from '../../engine/data';
import { Predicate } from '../../engine/predicate/predicate';

export interface IModelJson extends Omit<Jsonify<Model>, 'algorithms'> {
    algorithms: Array<{
        algorithm: ICoxSurvivalAlgorithmJson;
        predicate: PredicateJson;
    }>;
}

export function getAlgorithmJsonForPredicateData(
    modelJson: IModelJson,
    predicateData: Data,
): ICoxSurvivalAlgorithmJson {
    return Predicate.getFirstTruePredicateObject(
        modelJson.algorithms.map(algorithm => {
            return Object.assign({}, algorithm, {
                predicate: new Predicate(
                    algorithm.predicate.equation,
                    algorithm.predicate.variables,
                ),
            });
        }),
        predicateData,
    ).algorithm;
}
