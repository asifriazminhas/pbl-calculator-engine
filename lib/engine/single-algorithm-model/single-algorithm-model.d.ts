import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { IBaselineObject, Algorithm } from '../algorithm';
export declare type SingleAlgorithmModel = GenericSingleAlgorithmModel<Algorithm>;
export declare type NewBaseline = number | IBaselineObject;
export declare function updateBaselineForModel(model: SingleAlgorithmModel, newBaseline: NewBaseline): SingleAlgorithmModel;
