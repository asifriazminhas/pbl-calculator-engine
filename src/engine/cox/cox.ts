import { Covariate, getComponent, NonInteractionCovariate } from '../covariate';
import { Data, findDatumWithName } from '../data';
import { add } from 'lodash';
import { shouldLogDebugInfo } from '../env';
import { IGenericCox } from './generic-cox';
import * as moment from 'moment';
import { FieldType } from '../field';
import { OpType } from '../op-type';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineHazardFoundForAge } from '../errors';

export interface IBaselineHazardObject {
    [index: number]: number | undefined;
}

export type Cox = IGenericCox<Covariate, Function, IBaselineHazardObject>;

function calculateScore(cox: Cox, data: Data): number {
    return cox.covariates
        .map(covariate => getComponent(covariate, data, cox.userFunctions))
        .reduce(add);
}

export function getTimeMultiplier(time: moment.Moment) {
    return Math.abs(moment().diff(time, 'years', true));
}

function getBaselineHazardForData(cox: Cox, data: Data): number {
    if (typeof cox.baselineHazard === 'number') {
        return cox.baselineHazard;
    } else {
        const ageDatum = findDatumWithName('name', data);

        return throwErrorIfUndefined(
            cox.baselineHazard[Number(ageDatum.coefficent)],
            new NoBaselineHazardFoundForAge(ageDatum.coefficent as number),
        );
    }
}

// By default it's time argument is set to 1 year from now
export function getSurvivalToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    let formattedTime: moment.Moment;
    if (!time) {
        formattedTime = moment();
        formattedTime.add(1, 'year');
    } else if (time instanceof Date) {
        formattedTime = moment(time);
    } else {
        formattedTime = time;
    }

    if (shouldLogDebugInfo() === true) {
        console.groupCollapsed(`Predictors`);
    }

    if (shouldLogDebugInfo()) {
        console.log(`Baseline Hazard: ${this.baselineHazard}`);
    }

    if (shouldLogDebugInfo() === true) {
        console.groupEnd();
    }

    const score = calculateScore(cox, data);

    const oneYearSurvivalProbability =
        1 -
        Math.pow(
            Math.E,
            -1 * getBaselineHazardForData(cox, data) * Math.pow(Math.E, score),
        );

    return oneYearSurvivalProbability * getTimeMultiplier(formattedTime);
}

export function getRiskToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    return 1 - getSurvivalToTime(cox, data, time);
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

export function addPredictor(cox: Cox, predictor: INewPredictorTypes): Cox {
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

    return Object.assign({}, cox, {
        covariates: cox.covariates.concat([newCovariate]),
    });
}

export function updateBaselineHazard(
    cox: Cox,
    newBaselineHazard: number | IBaselineHazardObject,
): Cox {
    return Object.assign({}, cox, {
        baselineHazard: newBaselineHazard,
    });
}
