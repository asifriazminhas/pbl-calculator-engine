import { getRiskToTime } from '../cox/cox';
import { Data } from '../data';
import * as moment from 'moment';
import { ModelTypes, getAlgorithmForModelAndData } from '../model';

export interface GetRiskToTime {
    getRiskToTime: (data: Data, time?: Date | moment.Moment) => number;
}

export function getGetRiskToTime(
    model: ModelTypes
): GetRiskToTime {
    return {
        getRiskToTime: (data, time) => {
            return getRiskToTime(
                getAlgorithmForModelAndData(model, data), data, time);
        }
    };
}