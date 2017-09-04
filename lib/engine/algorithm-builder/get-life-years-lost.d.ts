import { Data } from '../common/datum';
import { RefLifeTable } from '../life-expectancy/life-expectancy';
export declare type GetLifeYearsLostFunction = (data: Data, riskFactor: string) => number;
export interface GetLifeYearsLost {
    getLifeYearsLost: GetLifeYearsLostFunction;
}
export declare function curryGetLifeYearsLostFunction(causeDeletedRef: any, refLifeTable: RefLifeTable): GetLifeYearsLostFunction;
