import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult, getRiskFactorKey } from './with-cause-impact-common';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { getSurvivalToTimeWithCauseImpact, CauseImpactRef } from '../../../cause-impact';
import { Data } from '../../../common/data';
import { Cox, getTimeMultiplier } from '../../../cox';
import * as moment from 'moment';

export interface GetSurvivalToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
    > {
    getSurvivalToTime: (time?: Date | moment.Moment) => U;
}

export function getGetSurvivalToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & WithCauseImpactChainMethodResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    riskFactors: string[],
    causeImpactRef: CauseImpactRef,
    cox: Cox
): GetSurvivalToTimeWithCauseImpact<T, U> {
    return {
        getSurvivalToTime: (time) => {
            const riskFactorKey = getRiskFactorKey(riskFactors);

            let survivalToTimeWithCauseImpact: number;
            if(
                !currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors || currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors[riskFactorKey] === undefined
            ) {
                const oneYearSurvivalToTimeForCurrentRiskFactor = getSurvivalToTimeWithCauseImpact(
                    causeImpactRef,
                    cox,
                    riskFactors,
                    data
                );

                currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors,
                        {
                            [riskFactorKey]: oneYearSurvivalToTimeForCurrentRiskFactor
                        }
                    );
                currentMemoizedData.oneYearRiskProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearRiskProbabilityForRiskFactors,
                        {
                            [riskFactorKey]: 1 - oneYearSurvivalToTimeForCurrentRiskFactor
                        }
                    )
            }

            survivalToTimeWithCauseImpact = ((currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors as {[index: string]: number})[riskFactorKey] as number)*getTimeMultiplier(moment(time))

            return getNextObjectInChain(
                Object.assign(
                    {},
                    currentResult,
                    updateWithCauseImpactChainMethodResult(
                        riskFactorKey,
                        {
                            [riskFactorKey]: {
                                survivalToTime: survivalToTimeWithCauseImpact
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