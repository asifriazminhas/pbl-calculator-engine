import { getRiskToTime, Cox } from '../cox/cox';
import { Data } from '../common/datum';
import * as moment from 'moment';

export interface GetRiskToTime {
    getRiskToTime: (data: Data, time?: Date | moment.Moment) => number;
}

export function getGetRiskToTime(
    cox: Cox
): GetRiskToTime {
    return {
        getRiskToTime: (data, time) => {
            return getRiskToTime(cox, data, time);
        }
    };
}