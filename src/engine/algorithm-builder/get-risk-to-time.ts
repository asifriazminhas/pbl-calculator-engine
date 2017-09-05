import { getRiskToTime, Cox } from '../cox/cox';
import { Data } from '../common/datum';
import * as moment from 'moment';

export type GetRiskToTimeFunction = (data: Data, time?: Date | moment.Moment) => number;

export interface GetRiskToTime {
    getRiskToTime: GetRiskToTimeFunction;
}

export function curryGetRiskToTimeFunction(
    cox: Cox
): GetRiskToTimeFunction {
    return (data, time) => {
        return getRiskToTime(cox, data, time);
    }
}