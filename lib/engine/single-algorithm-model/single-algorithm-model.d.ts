import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { IBaselineObject } from '../regression-algorithm/regression-algorithm';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
export declare type SingleAlgorithmModel<U extends AlgorithmTypes = AlgorithmTypes> = GenericSingleAlgorithmModel<U>;
export declare type NewBaseline = number | IBaselineObject;
export declare function updateBaselineForModel<T extends SingleAlgorithmModel<RegressionAlgorithmTypes>>(model: T, newBaseline: NewBaseline): T;
