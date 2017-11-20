import {
    SingleAlgorithmModel,
    updateBaselineForModel as updateBaselineForSingleAlgorithmModel,
    NewBaseline as SingleAlgorithmModelNewBaseline,
} from '../single-algorithm-model';
import {
    MultipleAlgorithmModel,
    getAlgorithmForData,
    updateBaselineForModel as updateBaselineForMultipleAlgorithmModel,
    NewBaseline as MultipleAlgorithmModelNewBaseline,
} from '../multiple-algorithm-model';
import { Data } from '../data';
import { ModelType } from './model-type';
import { Algorithm } from '../algorithm';

export type ModelTypes = SingleAlgorithmModel | MultipleAlgorithmModel;

export function getAlgorithmForModelAndData(
    model: ModelTypes,
    data: Data,
): Algorithm {
    if (model.modelType === ModelType.SingleAlgorithm) {
        return model.algorithm;
    } else {
        return getAlgorithmForData(model, data);
    }
}

export function updateBaselineForModel(
    model: ModelTypes,
    newBaseline:
        | number
        | SingleAlgorithmModelNewBaseline
        | MultipleAlgorithmModelNewBaseline,
): ModelTypes {
    if (model.modelType === ModelType.SingleAlgorithm) {
        return updateBaselineForSingleAlgorithmModel(
            model,
            newBaseline as SingleAlgorithmModelNewBaseline,
        );
    } else {
        return updateBaselineForMultipleAlgorithmModel(
            model,
            newBaseline as MultipleAlgorithmModelNewBaseline,
        );
    }
}
