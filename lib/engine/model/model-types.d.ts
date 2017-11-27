import { SingleAlgorithmModel, NewBaseline as SingleAlgorithmModelNewBaseline } from '../single-algorithm-model';
import { MultipleAlgorithmModel, NewBaseline as MultipleAlgorithmModelNewBaseline } from '../multiple-algorithm-model';
import { Data } from '../data';
import { Algorithm } from '../algorithm';
export declare type ModelTypes = SingleAlgorithmModel | MultipleAlgorithmModel;
export declare function getAlgorithmForModelAndData(model: ModelTypes, data: Data): Algorithm;
export declare function updateBaselineForModel(model: ModelTypes, newBaseline: number | SingleAlgorithmModelNewBaseline | MultipleAlgorithmModelNewBaseline): ModelTypes;
