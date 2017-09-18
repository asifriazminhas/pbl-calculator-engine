import { GetSurvivalToTimeWithCauseImpact, getGetSurvivalToTimeWithCauseImpact } from './get-survival-to-time';
import { GetRiskToTimeWithCauseImpact, getGetRiskToTimeWithCauseImpact } from './get-risk-to-time';
import { GetLifeExpectancyWithCauseImpact, getGetLifeExpectancyWithCauseImpact } from './get-life-expectancy';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';

export interface WithCauseImpactChainMethodResult {
    withCauseImpact: {
        [index: string]: {
            survivalToTime: number[],
            riskToTime: number[],
            lifeExpectancy: number
        }
    }
}

export interface WithCauseImpactAndCoxFunctions<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    withCauseImpact: () => GetSurvivalToTimeWithCauseImpact<T, U> & GetRiskToTimeWithCauseImpact<T, U>
}

export function getWithCauseImpactAndCoxFunctions<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & WithCauseImpactChainMethodResult, U>
): WithCauseImpactAndCoxFunctions<T, U> {
    return {
        withCauseImpact: () => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain
                ),
                getGetRiskToTimeWithCauseImpact(
                    currentResult,
                    getNextObjectInChain
                )
            )
        }
    }
}

export interface WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    withCauseImpact: () => GetSurvivalToTimeWithCauseImpact<T, U> & GetRiskToTimeWithCauseImpact<T, U> & GetLifeExpectancyWithCauseImpact<T, U>
}

export function getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & WithCauseImpactChainMethodResult, U>
): WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<T, U> {
    return {
        withCauseImpact: () => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain
                ),
                getGetRiskToTimeWithCauseImpact(
                    currentResult,
                    getNextObjectInChain
                ),
                getGetLifeExpectancyWithCauseImpact(
                    currentResult,
                    getNextObjectInChain
                )
            )
        }
    }
}