import * as moment from 'moment';
import { CompleteLifeTable } from '../../life-expectancy/life-expectancy';
import { Data } from '../../common/datum';
export interface GetRiskToTimeWithoutData {
    getRiskToTime: (time?: Date | moment.Moment) => number;
}
export declare function curryGetRiskToTimeWithoutData(lifeTable: CompleteLifeTable, data: Data): (time?: Date | moment.Moment) => number;
