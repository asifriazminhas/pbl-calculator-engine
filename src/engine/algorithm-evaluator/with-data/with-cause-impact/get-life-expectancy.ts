import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult } from './with-cause-impact-common';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { updateMemoizedData } from './update-memoized-data';
import { getLifeExpectancyWithCauseImpact } from '../../../cause-impact';
import { WithDataMemoizedData } from '../memoized-data';
import { RefLifeTable, CompleteLifeTable } from '../../../common/life-table';
import { CauseImpactRef } from '../../../cause-impact';
import { Cox } from '../../../cox';
import { Data } from '../../../common/data';

export interface GetLifeExpectancyWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    getLifeExpectancy: () => U;
}

export function getGetLifeExpectancyWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & WithCauseImpactChainMethodResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    refLifeTable: RefLifeTable,
    causeDeletedRef: CauseImpactRef,
    cox: Cox,
    riskFactor: string,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancyWithCauseImpact<T, U> {
    return {
        getLifeExpectancy: () => {
            const updatedMemoizedData = updateMemoizedData(
                currentMemoizedData,
                refLifeTable,
                riskFactor,
                data,
                causeDeletedRef,
                cox,
                useExFromLifeTableFromAge
            );

            const withCauseImpactLifeExpectancy = getLifeExpectancyWithCauseImpact(
                causeDeletedRef,
                cox,
                refLifeTable,
                riskFactor,
                data,
                useExFromLifeTableFromAge,
                (updatedMemoizedData.completeLifeTableForRiskFactors as {
                    [index: string]: CompleteLifeTable
                })[riskFactor],
            )

            return getNextObjectInChain(
                Object.assign(
                    {}, 
                    currentResult, 
                    updateWithCauseImpactChainMethodResult(
                        riskFactor,
                        {
                            [riskFactor]: {
                                lifeExpectancy: withCauseImpactLifeExpectancy
                            }
                        },
                        (currentResult as T & WithCauseImpactChainMethodResult).withCauseImpact
                    )
                ),
                currentMemoizedData
            )
        }
    }
}