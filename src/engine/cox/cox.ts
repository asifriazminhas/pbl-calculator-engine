import { Covariate, getComponent } from './covariate';
import { Data } from '../common/datum';
import { add } from 'lodash';
import { shouldLogDebugInfo} from '../common/env';
import { GenericCox } from '../common/generic-types';
import * as moment from 'moment';

export type Cox = GenericCox<Covariate>;

function calculateScore(
    cox: Cox,
    data: Data
): number {
    return cox.covariates
        .map(covariate => getComponent(covariate, data))
        .reduce(add);
}

//By default it's time argument is set to 1 year from now
export function getSurvivalToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment
): number {
    let formattedTime: moment.Moment;
    if (!time) {
        formattedTime = moment();
        formattedTime.add(1, 'year')
    }
    else if (time instanceof Date) {
        formattedTime = moment(time);
    }
    else {
        formattedTime = time;
    }

    if (shouldLogDebugInfo() === true) {
        console.groupCollapsed(`Predictors`)
    }

    if (shouldLogDebugInfo()) {
        console.log(`Baseline Hazard: ${this.baselineHazard}`);
    }

    if (shouldLogDebugInfo() === true) {
        console.groupEnd();
    }

    const score = calculateScore(cox, data);

    const oneYearSurvivalProbability = 1 - Math.pow(
        Math.E,
        -1 * cox.baselineHazard * Math.pow(Math.E, score)
    );

    return oneYearSurvivalProbability * Math.abs((moment().diff(formattedTime, 'years', true)));
}

export function getRisk(
    cox: Cox,
    data: Data
): number {
    return 1 - getSurvivalToTime(cox, data);
}