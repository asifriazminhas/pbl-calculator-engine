import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult } from './with-cause-impact-common';
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
    riskFactor: string,
    causeDeletedRef: CauseImpactRef,
    cox: Cox
): GetRiskToTimeWithCauseImpact<T, U> {
    return {
        getRiskToTime: (time) => {
            let riskToTimeWithCauseImpact: number;
            if(
                !currentMemoizedData.oneYearRiskProbabilityForRiskFactors || currentMemoizedData.oneYearRiskProbabilityForRiskFactors[riskFactor] === undefined
            ) {
                const oneYearRiskToTimeForCurrentRiskFactor = getRiskToTimeWithCauseImpact(
                    causeDeletedRef,
                    cox,
                    riskFactor,
                    data
                );

                currentMemoizedData.oneYearRiskProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearRiskProbabilityForRiskFactors,
                        {
                            [riskFactor]: oneYearRiskToTimeForCurrentRiskFactor
                        }
                    );
                currentMemoizedData.oneYearRiskProbabilityForRiskFactors = Object
                    .assign(
                        {}, 
                        currentMemoizedData.oneYearSurvivalProbability,
                        {
                            [riskFactor]: 1 - oneYearRiskToTimeForCurrentRiskFactor
                        }
                    )
            }

            riskToTimeWithCauseImpact = ((currentMemoizedData.oneYearRiskProbabilityForRiskFactors as {[index: string]: number})[riskFactor] as number)*getTimeMultiplier(moment(time))

            return getNextObjectInChain(
                Object.assign(
                    {},
                    currentResult,
                    updateWithCauseImpactChainMethodResult(
                        riskFactor,
                        {
                            [riskFactor]: {
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