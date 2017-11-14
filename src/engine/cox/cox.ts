import { Data, findDatumWithName } from '../data';
import { shouldLogDebugInfo } from '../env';
import * as moment from 'moment';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineHazardFoundForAge } from '../errors';
import { Algorithm, calculateScore } from '../algorithm';

export type Cox = Algorithm;

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
