import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Algorithm } from '../algorithm';
import { Data } from '../data';
import { IBaselineObject } from '../regression-algorithm/regression-algorithm';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
export declare type MultipleAlgorithmModel<U extends AlgorithmTypes = AlgorithmTypes> = GenericMultipleAlgorithmModel<U>;
export declare function getAlgorithmForData(multipleAlgorithmModel: MultipleAlgorithmModel, data: Data): Algorithm<any>;
export declare type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: IBaselineObject;
}>;
export declare function updateBaselineForModel(model: MultipleAlgorithmModel<RegressionAlgorithmTypes>, newBaselines: NewBaseline): MultipleAlgorithmModel<RegressionAlgorithmTypes>;
