import { Covariate } from '../covariate';
import { IGenericAlgorithm } from './generic-algorithm';
import { Data } from '../data';
export interface IBaselineObject {
    [index: number]: number | undefined;
}
export declare type Algorithm = IGenericAlgorithm<Covariate, () => any, IBaselineObject>;
export declare function calculateScore(algorithm: Algorithm, data: Data): number;
export declare function getBaselineForData(algorithm: Algorithm, data: Data): number;
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
export declare function addPredictor<T extends Algorithm>(algorithm: T, predictor: INewPredictorTypes): T;
export declare function updateBaseline<T extends Algorithm>(algorithm: T, newBaseline: number | IBaselineObject): T;
