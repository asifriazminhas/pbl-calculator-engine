import { Model } from '../../engine/model/model';
import { JsonSerializable } from '../../util/types';
import { Omit } from 'utility-types';
import { PredicateJson } from './json-predicate';
import { Data } from '../../engine/data';
import { Predicate } from '../../engine/predicate/predicate';
import { IDataFieldJson } from './json-data-field';
import { JsonAlgorithms } from './json-algorithms';

export interface IModelJson<T extends JsonAlgorithms>
    extends Omit<JsonSerializable<Model<any>>, 'algorithms' | 'modelFields'> {
    algorithms: Array<{
        algorithm: T;
        predicate: PredicateJson;
    }>;
    modelFields: IDataFieldJson[];
}

export function getAlgorithmJsonForPredicateData<T extends JsonAlgorithms>(
    modelJson: IModelJson<T>,
    predicateData: Data,
): T {
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
