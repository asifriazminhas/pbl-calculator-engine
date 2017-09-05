import { getSurvivalToTime, Cox } from '../cox/cox';
import { Data } from '../common/datum';
import * as moment from 'moment';

export interface GetSurvivalToTime {
    getSurvivalToTime: (data: Data, time?: Date | moment.Moment) => number;
}

export function getGetSurvivalToTime(
    cox: Cox
): GetSurvivalToTime {
    return {
        getSurvivalToTime: (data, time) => {
            return getSurvivalToTime(cox, data, time)
        }
    }
}