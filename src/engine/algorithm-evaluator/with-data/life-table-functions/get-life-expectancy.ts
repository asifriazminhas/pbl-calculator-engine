import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { RefLifeTable, CompleteLifeTableRow } from '../../../common/life-table';
import { getLifeExpectancyUsingRefLifeTable, getCompleteLifeTableForDataUsingAlgorithm } from '../../../life-expectancy';
import { Cox } from '../../../cox';
import { Data } from '../../../common/data';
import { Datum } from '../../../common/datum';

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
                if(!currentMemoizedData.oneYearSurvivalProbability) {
                    const ageDatum = data
                        .find((datum) => datum.coefficent === 'age') as Datum;
                    const lifeTableRowForAgeDatum = currentMemoizedData
                        .completeLifeTable
                        .find((lifeTableRow) => {
                            return lifeTableRow.age === ageDatum.coefficent;
                        }) as CompleteLifeTableRow;
                    currentMemoizedData.oneYearSurvivalProbability = lifeTableRowForAgeDatum.qx;
                    currentMemoizedData.oneYearRiskProbability = 1 - lifeTableRowForAgeDatum.qx;
                }
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