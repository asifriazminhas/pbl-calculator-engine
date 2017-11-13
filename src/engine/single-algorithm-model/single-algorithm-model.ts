import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { Cox, IBaselineHazardObject } from '../cox';
import { updateBaselineHazard } from '../cox/cox';

export type SingleAlgorithmModel = GenericSingleAlgorithmModel<Cox>;

export type NewBaselineHazard = number | IBaselineHazardObject;

export function updateBaselineHazardForModel(
    model: SingleAlgorithmModel,
    newBaselineHazard: NewBaselineHazard,
): SingleAlgorithmModel {
    return Object.assign({}, model, {
        algorithm: updateBaselineHazard(model.algorithm, newBaselineHazard),
    });
}
