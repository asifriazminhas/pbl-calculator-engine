import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import {
    updateBaselineHazard,
    IBaselineHazardObject,
    Algorithm,
} from '../algorithm';

export type SingleAlgorithmModel = GenericSingleAlgorithmModel<Algorithm>;

export type NewBaselineHazard = number | IBaselineHazardObject;

export function updateBaselineHazardForModel(
    model: SingleAlgorithmModel,
    newBaselineHazard: NewBaselineHazard,
): SingleAlgorithmModel {
    return Object.assign({}, model, {
        algorithm: updateBaselineHazard(model.algorithm, newBaselineHazard),
    });
}
