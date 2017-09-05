import { Data } from '../common/datum';
import { getLifeYearsLost } from '../life-years-lost/life-years-lost';
import { RefLifeTable } from '../common/life-table';

export interface GetLifeYearsLost {
    getLifeYearsLost: (
        data: Data,
        riskFactor: string
    ) => number;
}

//TODO Fix this
export function getGetLifeYearsLost(
    causeDeletedRef: any,
    refLifeTable: RefLifeTable
): GetLifeYearsLost {
    return {
        getLifeYearsLost: (data, riskFactor) => {
            return getLifeYearsLost(
                causeDeletedRef,
                refLifeTable,
                data,
                riskFactor
            );
        }
    };
}