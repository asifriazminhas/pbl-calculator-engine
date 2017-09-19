import { GetSurvivalToTimeWithCauseImpact, getGetSurvivalToTimeWithCauseImpact } from './get-survival-to-time';
import { GetRiskToTimeWithCauseImpact, getGetRiskToTimeWithCauseImpact } from './get-risk-to-time';
import { GetLifeExpectancyWithCauseImpact, getGetLifeExpectancyWithCauseImpact } from './get-life-expectancy';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { Data } from '../../../common/data';
import { RefLifeTable } from '../../../common/life-table';
import { CauseImpactRef } from '../../../cause-impact';
import { Cox } from '../../../cox';

export function getRiskFactorKey(
    riskFactors: string[]
): string {
    return riskFactors.join('+');
}

export function updateWithCauseImpactChainMethodResult(
    riskFactorKey: string,
    update: {
        [index: string]: {
            survivalToTime?: number,
            riskToTime?: number,
            lifeExpectancy?: number
        }
    },
    currentWithCauseImpactResult?: WithCauseImpactChainMethodResult['withCauseImpact']
): WithCauseImpactChainMethodResult {
    let updatedWithCauseImpactResult: WithCauseImpactChainMethodResult = {
        withCauseImpact: {}
    };
    if(currentWithCauseImpactResult) {
        updatedWithCauseImpactResult = {
            withCauseImpact: currentWithCauseImpactResult
        }
    }

    let updatedWithCauseImpactForCurrentRiskFactor = updatedWithCauseImpactResult.withCauseImpact[riskFactorKey];
    if(!updatedWithCauseImpactForCurrentRiskFactor) {
        updatedWithCauseImpactForCurrentRiskFactor = {
            riskToTime: [],
            survivalToTime: [],
            lifeExpectancy: undefined
        }
    }

    if(update[riskFactorKey].riskToTime !== undefined) {
        updatedWithCauseImpactForCurrentRiskFactor.riskToTime
            .push(update[riskFactorKey].riskToTime as number)
    }
    else if(update[riskFactorKey].survivalToTime !== undefined) {
        updatedWithCauseImpactForCurrentRiskFactor.survivalToTime
            .push(update[riskFactorKey].survivalToTime as number)
    }
    else if(update[riskFactorKey].lifeExpectancy !== undefined) {
        updatedWithCauseImpactForCurrentRiskFactor.lifeExpectancy = update[riskFactorKey].lifeExpectancy;
    }

    return Object.assign({}, updatedWithCauseImpactResult, {
        [riskFactorKey]: updatedWithCauseImpactForCurrentRiskFactor
    });
}

export interface WithCauseImpactChainMethodResult {
    withCauseImpact: {
        [index: string]: {
            survivalToTime: number[],
            riskToTime: number[],
            lifeExpectancy?: number
        }
    }
}

export interface WithCauseImpactAndCoxFunctions<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    withCauseImpact: (...riskFactors: string[]) => GetSurvivalToTimeWithCauseImpact<T, U> & GetRiskToTimeWithCauseImpact<T, U>
}

export function getWithCauseImpactAndCoxFunctions<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & WithCauseImpactChainMethodResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    causeDeletedRef: CauseImpactRef,
    cox: Cox
): WithCauseImpactAndCoxFunctions<T, U> {
    return {
        withCauseImpact: (...riskFactors) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    riskFactors,
                    causeDeletedRef,
                    cox
                ),
                getGetRiskToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    riskFactors,
                    causeDeletedRef,
                    cox
                )
            )
        }
    }
}

export interface WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    withCauseImpact: (...riskFactors: string[]) => GetSurvivalToTimeWithCauseImpact<T, U> & GetRiskToTimeWithCauseImpact<T, U> & GetLifeExpectancyWithCauseImpact<T, U>
}

export function getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<
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
    useExFromLifeTableFromAge: number = 99
): WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<T, U> {
    return {
        withCauseImpact: (...riskFactors) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    riskFactors,
                    causeDeletedRef,
                    cox
                ),
                getGetRiskToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    riskFactors,
                    causeDeletedRef,
                    cox
                ),
                getGetLifeExpectancyWithCauseImpact(
                    currentResult,
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    refLifeTable,
                    causeDeletedRef,
                    cox,
                    riskFactors,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}