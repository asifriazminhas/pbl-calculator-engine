import { Cox } from '../cox/cox';
import { getLifeExpectancyUsingRefLifeTable } from '../life-expectancy/life-expectancy';
import { RefLifeTable } from '../life-table';
import { Data } from '../common/datum';

export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}

export function getGetLifeExpectancy(
    coxAlgorithm: Cox,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancy {
    return {
        getLifeExpectancy: (data) => {
            return getLifeExpectancyUsingRefLifeTable(
                data,
                refLifeTable,
                coxAlgorithm,
                useExFromLifeTableFromAge
            )
        }
    }
}