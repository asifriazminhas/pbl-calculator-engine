import { getRiskToTime, Cox } from '../cox/cox';
import { Data } from '../common/datum';
import * as moment from 'moment';

export interface GetRiskToTime {
    getRiskToTime: (data: Data, time?: Date | moment.Moment) => number;
}

export function addGetRiskToTime<T extends object>(
    algorithmObj: T,
    cox: Cox
): T & GetRiskToTime {
    return Object.assign({}, algorithmObj, {
        getRiskToTime: (data: Data, time?: Date | moment.Moment) => {
            return getRiskToTime(cox, data, time);
        }
    })
}