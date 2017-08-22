import { Cox } from '../../cox/cox';
import { Data } from '../../common/datum';
import * as moment from 'moment';
export declare function curryGetSurvivalToTimeWithDataFunction(cox: Cox): (data: Data, time?: Date | moment.Moment) => number;
export interface GetSurvivalToTimeWithData {
    getSurvivalToTime: (data: Data, time?: Date | moment.Moment) => number;
}
