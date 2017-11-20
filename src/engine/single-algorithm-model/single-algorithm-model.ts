import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { updateBaseline, IBaselineObject, Algorithm } from '../algorithm';

export type SingleAlgorithmModel = GenericSingleAlgorithmModel<Algorithm>;

export type NewBaseline = number | IBaselineObject;

export function updateBaselineForModel(
    model: SingleAlgorithmModel,
    newBaseline: NewBaseline,
): SingleAlgorithmModel {
    return Object.assign({}, model, {
        algorithm: updateBaseline(model.algorithm, newBaseline),
    });
}
