import { Algorithm } from '../algorithm';
import { IGenericRegressionAlgorithm } from './generic-regression-algorithm';
import { Covariate } from '../covariate';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { Data } from '../data/index';
import { RegressionAlgorithmTypes } from './regression-algorithm-types';
export interface IBaselineObject {
    [index: number]: number | undefined;
}
export interface IRegressionAlgorithm<Z extends AlgorithmType> extends Algorithm<Z>, IGenericRegressionAlgorithm<Covariate, () => any, IBaselineObject, Z> {
}
export declare function calculateScore(algorithm: IRegressionAlgorithm<any>, data: Data): number;
export declare function getBaselineForData(algorithm: IRegressionAlgorithm<any>, data: Data): number;
export interface INewPredictor {
    name: string;
    betaCoefficent: number;
    referencePoint: number | undefined;
}
export interface INewCategoricalPredictor extends INewPredictor {
    type: 'categorical';
    categories: Array<{
        category: string;
        value: string;
    }>;
}
export interface INewContinuousPredictor extends INewPredictor {
    type: 'continuous';
    min: number | undefined;
    max: number | undefined;
}
export declare type INewPredictorTypes = INewCategoricalPredictor | INewContinuousPredictor;
export declare function addPredictor<T extends RegressionAlgorithmTypes>(algorithm: T, predictor: INewPredictorTypes): T;
export declare function updateBaseline<T extends RegressionAlgorithmTypes>(algorithm: T, newBaseline: number | IBaselineObject): T;
