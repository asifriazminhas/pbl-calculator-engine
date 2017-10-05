import { getLifeExpectancyUsingRefLifeTable } from '../life-expectancy/life-expectancy';
import { RefLifeTable } from '../life-table';
import { Data } from '../common/datum';
import { ModelTypes, getAlgorithmForModelAndData } from '../model';

export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}

export function getGetLifeExpectancy(
    model: ModelTypes,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancy {
    return {
        getLifeExpectancy: (data) => {
            return getLifeExpectancyUsingRefLifeTable(
                data,
                refLifeTable,
                getAlgorithmForModelAndData(model, data),
                useExFromLifeTableFromAge
            )
        }
    }
}