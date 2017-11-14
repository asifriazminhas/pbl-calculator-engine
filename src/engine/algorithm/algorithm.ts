import { Covariate, NonInteractionCovariate } from '../covariate';
import { IGenericAlgorithm } from './generic-algorithm';
import { Data, findDatumWithName } from '../data';
import { getComponent } from '../covariate';
import { add } from 'lodash';
import { FieldType } from '../field';
import { OpType } from '../op-type';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineHazardFoundForAge } from '../errors';

export interface IBaselineHazardObject {
    [index: number]: number | undefined;
}

export type Algorithm = IGenericAlgorithm<
    Covariate,
    () => any,
    IBaselineHazardObject
>;

export function calculateScore(algorithm: Algorithm, data: Data): number {
    return algorithm.covariates
        .map(covariate =>
            getComponent(covariate, data, algorithm.userFunctions),
        )
        .reduce(add);
}

export function getBaselineHazardForData(
    algorithm: Algorithm,
    data: Data,
): number {
    if (typeof algorithm.baselineHazard === 'number') {
        return algorithm.baselineHazard;
    } else {
        const ageDatum = findDatumWithName('name', data);

        return throwErrorIfUndefined(
            algorithm.baselineHazard[Number(ageDatum.coefficent)],
            new NoBaselineHazardFoundForAge(ageDatum.coefficent as number),
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

export function updateBaselineHazard<T extends Algorithm>(
    algorithm: T,
    newBaselineHazard: number | IBaselineHazardObject,
): T {
    return Object.assign({}, algorithm, {
        baselineHazard: newBaselineHazard,
    });
}
