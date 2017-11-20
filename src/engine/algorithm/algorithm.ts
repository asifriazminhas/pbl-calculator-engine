import { Covariate, NonInteractionCovariate } from '../covariate';
import { IGenericAlgorithm } from './generic-algorithm';
import { Data, findDatumWithName } from '../data';
import { getComponent } from '../covariate';
import { add } from 'lodash';
import { FieldType } from '../field';
import { OpType } from '../op-type';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineFoundForAge } from '../errors';

export interface IBaselineObject {
    [index: number]: number | undefined;
}

export type Algorithm = IGenericAlgorithm<
    Covariate,
    () => any,
    IBaselineObject
>;

export function calculateScore(algorithm: Algorithm, data: Data): number {
    return algorithm.covariates
        .map(covariate =>
            getComponent(covariate, data, algorithm.userFunctions),
        )
        .reduce(add);
}

export function getBaselineForData(algorithm: Algorithm, data: Data): number {
    if (typeof algorithm.baseline === 'number') {
        return algorithm.baseline;
    } else {
        const ageDatum = findDatumWithName('name', data);

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

export function addPredictor<T extends Algorithm>(
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

export function updateBaseline<T extends Algorithm>(
    algorithm: T,
    newBaseline: number | IBaselineObject,
): T {
    return Object.assign({}, algorithm, {
        baseline: newBaseline,
    });
}
