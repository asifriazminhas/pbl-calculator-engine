import { Data } from '../common/datum';
import { RefLifeTable } from '../common/life-table';
import { getLifeYearsLost } from '../life-years-lost';
import { CauseImpactRef } from '../cause-impact';
import { Cox } from '../cox';

export interface GetLifeYearsLost {
    getLifeYearsLost: (
        data: Data,
        riskFactor: string,
        useExFromLifeTableFromAge: number
    ) => number;
}

export function getGetLifeYearsLost(
    causeDeletedRef: CauseImpactRef,
    refLifeTable: RefLifeTable,
    cox: Cox
): GetLifeYearsLost {
    return {
        getLifeYearsLost: (data, riskFactor, useExFromLifeTableFromAge=99) => {
            return getLifeYearsLost(
                causeDeletedRef,
                refLifeTable,
                cox,
                data,
                riskFactor,
                useExFromLifeTableFromAge
            )
        }
    };
}