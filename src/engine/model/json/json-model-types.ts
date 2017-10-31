import { SingleAlgorithmModelJson } from './json-single-algorithm-model';
import { MultipleAlgorithmModelJson, getAlgorithmJsonForData } from './json-multiple-algorithm-model';
import { CoxJson } from '../../json-parser/json-types';
import { ModelType } from '../model-type';
import { Data } from '../../common/data';

export type JsonModelTypes = SingleAlgorithmModelJson | MultipleAlgorithmModelJson;

export function getAlgorithmJsonForModelAndData(
    model: JsonModelTypes,
    data: Data
): CoxJson {
    if(model.modelType === ModelType.SingleAlgorithm) {
        return model.algorithm;
    }
    else {
        return getAlgorithmJsonForData(
            model,
            data
        );
    }
}