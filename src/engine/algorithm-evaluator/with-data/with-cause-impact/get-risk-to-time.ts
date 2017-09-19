import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult, getRiskFactorKey } from './with-cause-impact-common';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { getRiskToTimeWithCauseImpact, CauseImpactRef } from '../../../cause-impact';
import { Data } from '../../../common/data';
import { Cox, getTimeMultiplier } from '../../../cox';
import * as moment from 'moment';

export interface GetRiskToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    getRiskToTime: (time?: Date | moment.Moment) => U;
}

export function getGetRiskToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & WithCauseImpactChainMethodResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    riskFactors: string[],
    causeDeletedRef: CauseImpactRef,
    cox: Cox
): GetRiskToTimeWithCauseImpact<T, U> {
    return {
        getRiskToTime: (time) => {
            const riskFactorKey = getRiskFactorKey(riskFactors);

            let riskToTimeWithCauseImpact: number;
            if(
                !currentMemoizedData.oneYearRiskProbabilityForRiskFactors || currentMemoizedData.oneYearRiskProbabilityForRiskFactors[riskFactorKey] === undefined
            ) {
                const oneYearRiskToTimeForCurrentRiskFactor = getRiskToTimeWithCauseImpact(
                    causeDeletedRef,
                    cox,
                    riskFactors,
                    data
                );

                currentMemoizedData.oneYearRiskProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearRiskProbabilityForRiskFactors,
                        {
                            [riskFactorKey]: oneYearRiskToTimeForCurrentRiskFactor
                        }
                    );
                currentMemoizedData.oneYearRiskProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearSurvivalProbability,
                        {
                            [riskFactorKey]: 1 - oneYearRiskToTimeForCurrentRiskFactor
                        }
                    )
            }

            riskToTimeWithCauseImpact = ((currentMemoizedData.oneYearRiskProbabilityForRiskFactors as {[index: string]: number})[riskFactorKey] as number)*getTimeMultiplier(moment(time))

            return getNextObjectInChain(
                Object.assign(
                    {},
                    currentResult,
                    updateWithCauseImpactChainMethodResult(
                        riskFactorKey,
                        {
                            [riskFactorKey]: {
                                riskToTime: riskToTimeWithCauseImpact
                            }
                        },
                        (currentResult as T & WithCauseImpactChainMethodResult).withCauseImpact
                    )
                ),
                currentMemoizedData
            );
        }
    }
}