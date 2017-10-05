import { SingleAlgorithmModel } from './single-algorithm-model';
import { MultipleAlgorithmModel, getAlgorithmForData } from './multiple-algorithm-model';
import { Data } from '../common/data';
import { Cox } from '../cox';
import { ModelType } from './model-type';

export type ModelTypes = SingleAlgorithmModel | MultipleAlgorithmModel;

export function getAlgorithmForModelAndData(
    model: ModelTypes,
    data: Data
): Cox {
    if(model.modelType === ModelType.SingleAlgorithm) {
        return model.algorithm;
    }
    else {
        return getAlgorithmForData(
            model,
            data
        );
    }
}