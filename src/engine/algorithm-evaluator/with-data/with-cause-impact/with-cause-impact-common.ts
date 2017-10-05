import { GetSurvivalToTimeWithCauseImpact, getGetSurvivalToTimeWithCauseImpact } from './get-survival-to-time';
import { GetRiskToTimeWithCauseImpact, getGetRiskToTimeWithCauseImpact } from './get-risk-to-time';
import { GetLifeExpectancyWithCauseImpact, getGetLifeExpectancyWithCauseImpact } from './get-life-expectancy';
import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { Data } from '../../../common/data';
import { RefLifeTable } from '../../../life-table';
import { CauseImpactRefTypes } from '../../../cause-impact';
import { ModelTypes, JsonModelTypes } from '../../../model';

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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes,
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
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getGetRiskToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    riskFactors,
                    model, 
                    modelJson,
                    causeImpactRef
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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes,
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
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getGetRiskToTimeWithCauseImpact(
                    currentResult, 
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    riskFactors,
                    model, 
                    modelJson,
                    causeImpactRef
                ),
                getGetLifeExpectancyWithCauseImpact(
                    currentResult,
                    getNextObjectInChain,
                    currentMemoizedData,
                    data,
                    refLifeTable,
                    model,
                    modelJson,
                    riskFactors,
                    useExFromLifeTableFromAge,
                    causeImpactRef
                )
            )
        }
    }
}