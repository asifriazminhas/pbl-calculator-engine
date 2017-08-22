import { Data } from '../../common/datum';
import * as moment from 'moment';
import { Cox } from '../../cox/cox';
export interface GetRiskToTimeWithData {
    getRiskToTime: (data: Data, time?: Date | moment.Moment) => number;
}
export declare function curryGetRiskToTimeWithDataFunction(cox: Cox): (data: Data, time?: Date | moment.Moment) => number;
