import { getSurvivalToTime, Cox } from '../cox/cox';
import { Data } from '../common/datum';
import * as moment from 'moment';

export function curryGetSurvivalToTimeFunction(
    cox: Cox
): (data: Data, time?: Date | moment.Moment) => number {
    return (data, time) => {
        return getSurvivalToTime(cox, data, time);
    }
}

export interface GetSurvivalToTime {
    getSurvivalToTime: (data: Data, time?: Date | moment.Moment) => number;
}