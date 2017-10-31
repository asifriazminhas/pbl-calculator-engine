import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { RefLifeTable } from '../../../life-table';
import { getLifeExpectancyUsingRefLifeTable } from '../../../life-expectancy';
import { Data } from '../../../data';
import { updateMemoizedData } from './update-memoized-data';
import { ModelTypes, getAlgorithmForModelAndData } from '../../../model';

export interface GetLifeExpectancyResult {
    lifeExpectancy: number;
}

export interface GetLifeExpectancy<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeExpectancyResult>
> {
    getLifeExpectancy: () => U;
}

export function getGetLifeExpectancy<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeExpectancyResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetLifeExpectancyResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    refLifeTable: RefLifeTable,
    model: ModelTypes,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancy<T, U> {
    return {
        getLifeExpectancy: () => {
            const cox = getAlgorithmForModelAndData(model, data);

            const updatedMemoizedData = updateMemoizedData(
                currentMemoizedData,
                refLifeTable,
                data,
                cox,
                useExFromLifeTableFromAge
            );

            const lifeExpectancy = getLifeExpectancyUsingRefLifeTable(
                data,
                refLifeTable,
                cox,
                useExFromLifeTableFromAge,
                updatedMemoizedData.completeLifeTable
            );

            return getNextObjectInChain(
                Object.assign({}, currentResult, { lifeExpectancy }),
                updatedMemoizedData
            );
        }
    }
}