import { Algorithm } from '../algorithm';
import { IGenericRegressionAlgorithm } from './generic-regression-algorithm';
import { Covariate, getComponent, NonInteractionCovariate } from '../covariate';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { Data } from '../data/index';
import { add } from 'lodash';
import { RegressionAlgorithmTypes } from './regression-algorithm-types';
import { FieldType } from '../field/index';
import { OpType } from '../op-type/index';
import { IBaselineMixin } from './baseline/baseline';
import { ICalibratedMixin } from './calibration/calibration';

export interface IRegressionAlgorithm<Z extends AlgorithmType>
    extends Algorithm<Z>,
        IGenericRegressionAlgorithm<Covariate, () => any, Z>,
        ICalibratedMixin {}

export function calculateScore(
    algorithm: IRegressionAlgorithm<any>,
    data: Data,
): number {
    return algorithm.covariates
        .map(covariate =>
            getComponent(
                covariate,
                data,
                algorithm.userFunctions,
                algorithm.tables,
            ),
        )
        .reduce(add, 0);
}

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
export type INewPredictorTypes =
    | INewCategoricalPredictor
    | INewContinuousPredictor;

export function addPredictor<T extends RegressionAlgorithmTypes>(
    algorithm: T,
    predictor: INewPredictorTypes,
): T {
    let newCovariate: NonInteractionCovariate = Object.assign({}, predictor, {
        fieldType: FieldType.NonInteractionCovariate as FieldType.NonInteractionCovariate,
        beta: predictor.betaCoefficent,
        referencePoint: predictor.referencePoint ? predictor.referencePoint : 0,
        customFunction: undefined,
        name: predictor.name,
        displayName: '',
        extensions: {},
        derivedField: undefined,
    });
    if (predictor.type === 'continuous') {
        newCovariate = Object.assign({}, newCovariate, {
            opType: OpType.Continuous,
            min: predictor.min,
            max: predictor.max,
        });
    } else {
        newCovariate = Object.assign({}, newCovariate, {
            opType: OpType.Categorical,
            categories: predictor.categories,
        });
    }

    return Object.assign({}, algorithm, {
        covariates: algorithm.covariates.concat([newCovariate]),
    });
}

export function updateBaseline<T extends RegressionAlgorithmTypes>(
    algorithm: T,
    newBaseline: IBaselineMixin,
): T {
    return Object.assign({}, algorithm, {
        baseline: newBaseline,
    });
}
