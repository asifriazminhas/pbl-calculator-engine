import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { RefLifeTable } from '../../../life-table';
import { getLifeExpectancyUsingRefLifeTable } from '../../../life-expectancy';
import { Cox } from '../../../cox';
import { Data } from '../../../common/data';
import { updateMemoizedData } from './update-memoized-data';

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
    cox: Cox,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancy<T, U> {
    return {
        getLifeExpectancy: () => {
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