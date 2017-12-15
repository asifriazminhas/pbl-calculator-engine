import { SingleAlgorithmModel, NewBaseline as SingleAlgorithmModelNewBaseline } from '../single-algorithm-model';
import { MultipleAlgorithmModel, NewBaseline as MultipleAlgorithmModelNewBaseline } from '../multiple-algorithm-model';
import { Data } from '../data';
import { Algorithm } from '../algorithm';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
export declare type ModelTypes<U extends AlgorithmTypes = AlgorithmTypes> = SingleAlgorithmModel<U> | MultipleAlgorithmModel<U>;
export declare function getAlgorithmForModelAndData(model: ModelTypes, data: Data): Algorithm<any>;
export declare function updateBaselineForModel(model: ModelTypes<RegressionAlgorithmTypes>, newBaseline: number | SingleAlgorithmModelNewBaseline | MultipleAlgorithmModelNewBaseline): ModelTypes<RegressionAlgorithmTypes>;
