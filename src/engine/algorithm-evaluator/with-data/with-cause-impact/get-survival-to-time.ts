import { WithCauseImpactChainMethodResult, updateWithCauseImpactChainMethodResult, getRiskFactorKey } from './with-cause-impact-common';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { getSurvivalToTimeWithCauseImpact, CauseImpactRef, CauseImpactRefTypes, getCauseImpactRefForData } from '../../../cause-impact';
import { Data } from '../../../data';
import { getTimeMultiplier } from '../../../cox';
import * as moment from 'moment';
import { ModelTypes, JsonModelTypes, getAlgorithmForModelAndData, getAlgorithmJsonForModelAndData } from '../../../model';

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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes,
): GetSurvivalToTimeWithCauseImpact<T, U> {
    return {
        getSurvivalToTime: (time) => {
            const riskFactorKey = getRiskFactorKey(riskFactors);

            const cox = getAlgorithmForModelAndData(
                model, data
            );

            let causeImpactRefToUse: CauseImpactRef;
            if(causeImpactRef) {
                causeImpactRefToUse = getCauseImpactRefForData(
                    causeImpactRef,
                    data
                )
            } else {
                causeImpactRefToUse = getAlgorithmJsonForModelAndData(
                    modelJson, data
                ).causeDeletedRef;
            }

            let survivalToTimeWithCauseImpact: number;
            if(
                !currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors || currentMemoizedData.oneYearSurvivalProbabilityForRiskFactors[riskFactorKey] === undefined
            ) {
                const oneYearSurvivalToTimeForCurrentRiskFactor = getSurvivalToTimeWithCauseImpact(
                    causeImpactRefToUse,
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