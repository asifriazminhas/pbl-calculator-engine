import { Cox } from '../cox/cox';
import { BaseLifeTableRow } from '../life-expectancy/life-expectancy';
import { Data } from '../common/datum';
import * as moment from 'moment';
export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}
export declare function curryGetLifeExpectancyFunction(coxAlgorithm: Cox, baseLifeTable: Array<BaseLifeTableRow>, useExFromLifeTableFromAge?: number): (data: Data, time?: Date | moment.Moment) => number;
