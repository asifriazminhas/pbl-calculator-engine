import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Algorithm } from '../algorithm';
import { Data } from '../data';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
import { IBaselineMixin } from '../regression-algorithm/baseline/baseline';
export declare type MultipleAlgorithmModel<U extends AlgorithmTypes = AlgorithmTypes> = GenericMultipleAlgorithmModel<U>;
export declare function getAlgorithmForData(multipleAlgorithmModel: MultipleAlgorithmModel, data: Data): Algorithm<any>;
export declare type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: IBaselineMixin;
}>;
export declare function updateBaselineForModel(model: MultipleAlgorithmModel<RegressionAlgorithmTypes>, newBaselines: NewBaseline): MultipleAlgorithmModel<RegressionAlgorithmTypes>;
