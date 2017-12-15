import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import {
    IBaselineObject,
    updateBaseline,
} from '../regression-algorithm/regression-algorithm';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
import { AlgorithmTypes } from '../algorithm/algorithm-types';

export type SingleAlgorithmModel<
    U extends AlgorithmTypes = AlgorithmTypes
> = GenericSingleAlgorithmModel<U>;

export type NewBaseline = number | IBaselineObject;

export function updateBaselineForModel<
    T extends SingleAlgorithmModel<RegressionAlgorithmTypes>
>(model: T, newBaseline: NewBaseline): T {
    return Object.assign({}, model, {
        algorithm: updateBaseline(model.algorithm, newBaseline),
    });
}
