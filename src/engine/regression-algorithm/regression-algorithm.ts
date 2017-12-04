import { Algorithm } from '../algorithm';
import { IGenericRegressionAlgorithm } from './generic-regression-algorithm';
import { Covariate, getComponent, NonInteractionCovariate } from '../covariate';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { Data, findDatumWithName } from '../data/index';
import { add } from 'lodash';
import { throwErrorIfUndefined } from '../undefined/index';
import { NoBaselineFoundForAge } from '../errors/index';
import { RegressionAlgorithmTypes } from './regression-algorithm-types';
import { FieldType } from '../field/index';
import { OpType } from '../op-type/index';

export interface IBaselineObject {
    [index: number]: number | undefined;
}

export interface IRegressionAlgorithm<Z extends AlgorithmType>
    extends Algorithm<Z>,
        IGenericRegressionAlgorithm<Covariate, () => any, IBaselineObject, Z> {}

export function calculateScore(
    algorithm: IRegressionAlgorithm<any>,
    data: Data,
): number {
    return algorithm.covariates
        .map(covariate =>
            getComponent(covariate, data, algorithm.userFunctions),
        )
        .reduce(add, 0);
}

export function getBaselineForData(
    algorithm: IRegressionAlgorithm<any>,
    data: Data,
): number {
    if (typeof algorithm.baseline === 'number') {
        return algorithm.baseline;
    } else {
        const ageDatum = findDatumWithName('age', data);

        return throwErrorIfUndefined(
            algorithm.baseline[Number(ageDatum.coefficent)],
            new NoBaselineFoundForAge(ageDatum.coefficent as number),
        );
    }
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
    newBaseline: number | IBaselineObject,
): T {
    return Object.assign({}, algorithm, {
        baseline: newBaseline,
    });
}
