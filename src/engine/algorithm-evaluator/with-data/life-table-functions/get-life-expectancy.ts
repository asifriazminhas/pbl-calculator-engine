import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { RefLifeTable } from '../../../common/life-table';
import { getLifeExpectancyUsingRefLifeTable, getCompleteLifeTableForDataUsingAlgorithm } from '../../../life-expectancy';
import { Cox } from '../../../cox';
import { Data } from '../../../common/data';

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
            if(!currentMemoizedData.completeLifeTable) {
                currentMemoizedData.completeLifeTable = getCompleteLifeTableForDataUsingAlgorithm(
                    refLifeTable,
                    data,
                    cox,
                    useExFromLifeTableFromAge
                );
            }

            const lifeExpectancy = getLifeExpectancyUsingRefLifeTable(
                data,
                refLifeTable,
                cox,
                useExFromLifeTableFromAge,
                currentMemoizedData.completeLifeTable
            );

            return getNextObjectInChain(
                Object.assign({}, currentResult, { lifeExpectancy }),
                currentMemoizedData
            );
        }
    }
}