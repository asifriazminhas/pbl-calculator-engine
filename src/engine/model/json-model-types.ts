import { SingleAlgorithmModelJson } from '../single-algorithm-model';
import {
    MultipleAlgorithmModelJson,
    getAlgorithmJsonForData,
} from '../multiple-algorithm-model';
import { ICoxJson } from '../cox';
import { ModelType } from './model-type';
import { Data } from '../data';

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
