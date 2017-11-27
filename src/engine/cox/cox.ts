import { Data } from '../data';
import { shouldLogDebugInfo } from '../env';
import * as moment from 'moment';
import {
    Algorithm,
    AlgorithmType,
    calculateScore,
    getBaselineForData,
} from '../algorithm';

export interface Cox extends Algorithm {
    algorithmType: AlgorithmType.Cox;
}

export function getTimeMultiplier(time: moment.Moment) {
    return Math.abs(
        moment()
            .startOf('day')
            .diff(time, 'years', true),
    );
}

// By default it's time argument is set to 1 year from now
export function getSurvivalToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    let formattedTime: moment.Moment;
    if (!time) {
        formattedTime = moment().startOf('day');
        formattedTime.add(1, 'year');
    } else if (time instanceof Date) {
        formattedTime = moment(time).startOf('day');
    } else {
        formattedTime = time;
    }

    if (shouldLogDebugInfo() === true) {
        console.groupCollapsed(`Predictors`);
    }

    if (shouldLogDebugInfo()) {
        console.log(`Baseline: ${this.baseline}`);
    }

    if (shouldLogDebugInfo() === true) {
        console.groupEnd();
    }

    const score = calculateScore(cox, data);

    const oneYearSurvivalProbability =
        1 - getBaselineForData(cox, data) * Math.pow(Math.E, score);

    return oneYearSurvivalProbability * getTimeMultiplier(formattedTime);
}

export function getRiskToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    return 1 - getSurvivalToTime(cox, data, time);
}
