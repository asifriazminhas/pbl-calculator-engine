import { getSurvivalToTime } from '../cox/cox';
import { Data } from '../data';
import * as moment from 'moment';
import { ModelTypes, getAlgorithmForModelAndData } from '../model';

export interface GetSurvivalToTime {
    getSurvivalToTime: (data: Data, time?: Date | moment.Moment) => number;
}

export function getGetSurvivalToTime(
    model: ModelTypes
): GetSurvivalToTime {
    return {
        getSurvivalToTime: (data, time) => {
            return getSurvivalToTime(
                getAlgorithmForModelAndData(model, data), data, time)
        }
    }
}