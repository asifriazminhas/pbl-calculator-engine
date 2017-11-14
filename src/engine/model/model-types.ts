import {
    SingleAlgorithmModel,
    updateBaselineHazardForModel as updateBaselineHazardForSingleAlgorithmModel,
    NewBaselineHazard as SingleAlgorithmModelNewBaselineHazard,
} from '../single-algorithm-model';
import {
    MultipleAlgorithmModel,
    getAlgorithmForData,
    updateBaselineHazardForModel as updateBaselineHazardForMultipleAlgorithmModel,
    NewBaselineHazard as MultipleAlgorithmModelNewBaselineHazard,
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

export function updateBaselineHazardForModel(
    model: ModelTypes,
    newBaselineHazard:
        | number
        | SingleAlgorithmModelNewBaselineHazard
        | MultipleAlgorithmModelNewBaselineHazard,
): ModelTypes {
    if (model.modelType === ModelType.SingleAlgorithm) {
        return updateBaselineHazardForSingleAlgorithmModel(
            model,
            newBaselineHazard as SingleAlgorithmModelNewBaselineHazard,
        );
    } else {
        return updateBaselineHazardForMultipleAlgorithmModel(
            model,
            newBaselineHazard as MultipleAlgorithmModelNewBaselineHazard,
        );
    }
}
