import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Algorithm } from '../algorithm';
import { IBaselineObject } from '../algorithm';
import { Data } from '../data';
export declare type MultipleAlgorithmModel = GenericMultipleAlgorithmModel<Algorithm>;
export declare function getAlgorithmForData(multipleAlgorithmModel: MultipleAlgorithmModel, data: Data): Algorithm;
export declare type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: IBaselineObject;
}>;
export declare function updateBaselineForModel(model: MultipleAlgorithmModel, newBaselines: NewBaseline): MultipleAlgorithmModel;
