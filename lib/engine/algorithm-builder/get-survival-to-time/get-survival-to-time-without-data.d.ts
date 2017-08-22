import * as moment from 'moment';
import { CompleteLifeTable } from '../../life-expectancy/life-expectancy';
import { Data } from '../../common/datum';
export interface GetSurvivalToTimeWithoutDataAndLifeTable {
    getSurvivalToTime: (time?: Date | moment.Moment) => number;
}
export declare function curryGetSurvivalToTimeWithoutDataAndLifeTable(data: Data, lifeTable: CompleteLifeTable): (time?: Date | moment.Moment) => number;
