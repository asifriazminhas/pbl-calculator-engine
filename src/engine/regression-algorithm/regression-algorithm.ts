import { IAlgorithm } from '../algorithm';
import { IGenericRegressionAlgorithm } from './generic-regression-algorithm';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { Data } from '../data/data';
import { add } from 'lodash';
import { RegressionAlgorithmTypes } from './regression-algorithm-types';
import { IBaselineMixin } from './baseline/baseline';
import { ICalibratedMixin } from './calibration/calibration';
import { Covariate } from '../data-field/covariate/covariate';
import { NonInteractionCovariate } from '../data-field/covariate/non-interaction-covariats/non-interaction-covariate';

export interface IRegressionAlgorithm<Z extends AlgorithmType>
    extends IAlgorithm<Z>,
        IGenericRegressionAlgorithm<Covariate, () => any, Z>,
        ICalibratedMixin {}

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

export function updateBaseline<T extends RegressionAlgorithmTypes>(
    algorithm: T,
    newBaseline: IBaselineMixin,
): T {
    return Object.assign({}, algorithm, {
        baseline: newBaseline,
    });
}

export function calculateScore(
    algorithm: IRegressionAlgorithm<any>,
    data: Data,
): number {
    return algorithm.covariates
        .map(covariate =>
            covariate.getComponent(
                data,
                algorithm.userFunctions,
                algorithm.tables,
            ),
        )
        .reduce(add, 0);
}

export function addPredictor<T extends RegressionAlgorithmTypes>(
    algorithm: T,
    predictor: INewPredictorTypes,
): T {
    const newCovariate: NonInteractionCovariate = new NonInteractionCovariate(
        {
            dataFieldType: 0,
            beta: predictor.betaCoefficent,
            referencePoint: predictor.referencePoint
                ? predictor.referencePoint
                : 0,
            name: predictor.name,
        },
        undefined,
        undefined,
    );

    return Object.assign({}, algorithm, {
        covariates: algorithm.covariates.concat([newCovariate]),
    });
}
