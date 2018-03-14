import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
import { IBaselineMixin } from '../regression-algorithm/baseline/baseline';
export declare type SingleAlgorithmModel<U extends AlgorithmTypes = AlgorithmTypes> = GenericSingleAlgorithmModel<U>;
export declare type NewBaseline = IBaselineMixin;
export declare function updateBaselineForModel<T extends SingleAlgorithmModel<RegressionAlgorithmTypes>>(model: T, newBaseline: NewBaseline): T;
