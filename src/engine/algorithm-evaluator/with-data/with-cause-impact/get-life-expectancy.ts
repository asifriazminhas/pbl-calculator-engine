import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult, getRiskFactorKey } from './with-cause-impact-common';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { updateMemoizedData } from './update-memoized-data';
import { getLifeExpectancyWithCauseImpact } from '../../../cause-impact';
import { WithDataMemoizedData } from '../memoized-data';
import { RefLifeTable, CompleteLifeTable } from '../../../life-table';
import { CauseImpactRef, CauseImpactRefTypes, getCauseImpactRefForData } from '../../../cause-impact';
import { Data } from '../../../common/data';
import { ModelTypes, JsonModelTypes, getAlgorithmForModelAndData, getAlgorithmJsonForModelAndData } from '../../../model';

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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    riskFactors: string[],
    useExFromLifeTableFromAge: number = 99,
    causeImpactRef?: CauseImpactRefTypes,
): GetLifeExpectancyWithCauseImpact<T, U> {
    return {
        getLifeExpectancy: () => {
            const riskFactorKey = getRiskFactorKey(riskFactors);

            let causeImpactRefToUse: CauseImpactRef;
            if(causeImpactRef) {
                causeImpactRefToUse = getCauseImpactRefForData(
                    causeImpactRef, data
                );
            } else {
                causeImpactRefToUse = getAlgorithmJsonForModelAndData(
                    modelJson, data
                ).causeDeletedRef
            }

            const cox = getAlgorithmForModelAndData(
                model, data
            );

            const updatedMemoizedData = updateMemoizedData(
                currentMemoizedData,
                refLifeTable,
                riskFactors,
                data,
                causeImpactRefToUse,
                cox,
                useExFromLifeTableFromAge
            );

            const withCauseImpactLifeExpectancy = getLifeExpectancyWithCauseImpact(
                causeImpactRefToUse,
                cox,
                refLifeTable,
                riskFactors,
                data,
                useExFromLifeTableFromAge,
                (updatedMemoizedData.completeLifeTableForRiskFactors as {
                    [index: string]: CompleteLifeTable
                })[riskFactorKey],
            )

            return getNextObjectInChain(
                Object.assign(
                    {}, 
                    currentResult, 
                    updateWithCauseImpactChainMethodResult(
                        riskFactorKey,
                        {
                            [riskFactorKey]: {
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