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
import { IAlgorithm } from '../algorithm';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';

export type ModelTypes<U extends AlgorithmTypes = AlgorithmTypes> =
    | SingleAlgorithmModel<U>
    | MultipleAlgorithmModel<U>;

export function getAlgorithmForModelAndData(
    model: ModelTypes,
    data: Data,
): IAlgorithm<any> {
    if (model.modelType === ModelType.SingleAlgorithm) {
        return model.algorithm;
    } else {
        return getAlgorithmForData(model, data);
    }
}

export function updateBaselineForModel(
    model: ModelTypes<RegressionAlgorithmTypes>,
    newBaseline:
        | number
        | SingleAlgorithmModelNewBaseline
        | MultipleAlgorithmModelNewBaseline,
): ModelTypes<RegressionAlgorithmTypes> {
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
