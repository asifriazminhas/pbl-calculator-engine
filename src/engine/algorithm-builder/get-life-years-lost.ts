import { Data } from '../common/datum';
import { getLifeYearsLost } from '../life-years-lost/life-years-lost';
import { RefLifeTable } from '../life-expectancy/life-expectancy';

export type GetLifeYearsLostFunction = (
    data: Data,
    riskFactor: string
) => number;

export interface GetLifeYearsLost {
    getLifeYearsLost: GetLifeYearsLostFunction;
}

//TODO Fix this
export function curryGetLifeYearsLostFunction(
    causeDeletedRef: any,
    refLifeTable: RefLifeTable
): GetLifeYearsLostFunction {
    return (data, riskFactor) => {
        return getLifeYearsLost(
            causeDeletedRef,
            refLifeTable,
            data,
            riskFactor
        );
    };
}