import { SingleAlgorithmModelJson } from '../single-algorithm-model';
import {
    MultipleAlgorithmModelJson,
    getAlgorithmJsonForData,
} from '../multiple-algorithm-model';
import { ICoxJson } from '../cox';
import { ModelType } from './model-type';
import { Data } from '../data';
import { ModelTypes } from './model-types';
import { parseAlgorithmJson } from '../algorithm';

export type JsonModelTypes =
    | SingleAlgorithmModelJson
    | MultipleAlgorithmModelJson;

export function getAlgorithmJsonForModelAndData(
    model: JsonModelTypes,
    data: Data,
): ICoxJson {
    if (model.modelType === ModelType.SingleAlgorithm) {
        return model.algorithm;
    } else {
        return getAlgorithmJsonForData(model, data);
    }
}

export function parseModelJsonToModel(
    modelTypeJson: JsonModelTypes,
): ModelTypes {
    if (modelTypeJson.modelType === ModelType.SingleAlgorithm) {
        return Object.assign({}, modelTypeJson, {
            algorithm: parseAlgorithmJson(modelTypeJson.algorithm),
        });
    } else {
        return Object.assign({}, modelTypeJson, {
            algorithms: modelTypeJson.algorithms.map(
                ({ algorithm, predicate }) => {
                    return {
                        algorithm: parseAlgorithmJson(algorithm),
                        predicate,
                    };
                },
            ),
        });
    }
}
