import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

export type SingleAlgorithmModel = GenericSingleAlgorithmModel<
    CoxSurvivalAlgorithm
>;

export type NewBaseline =
    | number
    | {
          [index: number]: number;
      };

export function updateBaselineForModel(
    model: SingleAlgorithmModel,
    newBaseline: NewBaseline,
): SingleAlgorithmModel {
    return Object.assign({}, model, {
        algorithm: model.algorithm.updateBaseline(newBaseline),
    });
}
