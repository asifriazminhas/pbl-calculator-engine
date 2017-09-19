import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult } from './with-cause-impact-common';
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
    riskFactor: string,
    causeDeletedRef: CauseImpactRef,
    cox: Cox
): GetSurvivalToTimeWithCauseImpact<T, U> {
    return {
        getSurvivalToTime: (time) => {
            let survivalToTimeWithCauseImpact: number;
            if(
                !currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors || currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors[riskFactor] === undefined
            ) {
                const oneYearSurvivalToTimeForCurrentRiskFactor = getSurvivalToTimeWithCauseImpact(
                    causeDeletedRef,
                    cox,
                    riskFactor,
                    data
                );

                currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors,
                        {
                            [riskFactor]: oneYearSurvivalToTimeForCurrentRiskFactor
                        }
                    );
                currentMemoizedData.oneYearRiskProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearRiskProbabilityForRiskFactors,
                        {
                            [riskFactor]: 1 - oneYearSurvivalToTimeForCurrentRiskFactor
                        }
                    )
            }

            survivalToTimeWithCauseImpact = ((currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors as {[index: string]: number})[riskFactor] as number)*getTimeMultiplier(moment(time))

            return getNextObjectInChain(
                Object.assign(
                    {},
                    currentResult,
                    updateWithCauseImpactChainMethodResult(
                        riskFactor,
                        {
                            [riskFactor]: {
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