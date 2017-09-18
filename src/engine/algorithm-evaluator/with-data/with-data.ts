import { End, getEnd } from './end';
import { GetSurvivalToTime, GetSurvivalToTimeResult, getGetSurvivalToTime, GetRiskToTime, GetRiskToTimeResult, getGetRiskToTime } from './cox-functions';
import { GetLifeExpectancy, GetLifeExpectancyResult, getGetLifeExpectancy, GetLifeYearsLost, GetLifeYearsLostResult, getGetLifeYearsLost, GetSurvivalToAge, GetSurvivalToAgeResult, getGetSurvivalToAge } from './life-table-functions';
import { GetHealthAge, GetHealthAgeResult, getGetHealthAge } from './add-ref-pop-functions';
import { WithCauseImpactAndCoxFunctions, getWithCauseImpactAndCoxFunctions, WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction, WithCauseImpactChainMethodResult } from './with-cause-impact';
import { WithDataMemoizedData } from './memoized-data';
import { Data } from '../../common/data';
import { Cox } from '../../cox';

export interface BaseWithDataResult<T extends object> extends End<T> {

}
export function getBaseWithDataResult<T extends object>(
    currentResult: T
): BaseWithDataResult<T> {
    return Object.assign({}, getEnd(currentResult));
}

export type getNextObjectInChain<
    T extends object,
    U extends BaseWithDataResult<T>
> = (nextResult: T, memoizedData: WithDataMemoizedData) => U;

export interface WithDataAndCoxFunctionsResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, WithDataAndCoxFunctionsResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, WithDataAndCoxFunctionsResult<T & GetRiskToTimeResult>>, WithCauseImpactAndCoxFunctions<T, WithDataAndCoxFunctionsResult<T & WithCauseImpactChainMethodResult>> {

}
export interface WithDataAndCoxFunctions<T extends object> {
    withData: (data: Data) => WithDataAndCoxFunctionsResult<T>;
}
export function getWithDataAndCoxFunctionsResult<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    data: Data,
    cox: Cox
): WithDataAndCoxFunctionsResult<T> {
    const getNextObjectInChain = (
        nextResult: any,
        memoizedData: any
    ) => {
        return getWithDataAndCoxFunctionsResult(
            nextResult, 
            memoizedData,
            data,
            cox
        );
    }

    return Object.assign(
        {},
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain, 
            memoizedData,
            data,
            cox
        ),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctions(currentResult, getNextObjectInChain)
    )
}
export function getWithDataAndCoxFunctions<T extends object>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    cox: Cox
): WithDataAndCoxFunctions<T> {
    return {
        withData: (data) => {
            return getWithDataAndCoxFunctionsResult(
                currentResult,
                memoizedData,
                data,
                cox
            );
        }
    }
}

export interface WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetRiskToTimeResult>>, GetLifeExpectancy<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetLifeExpectancyResult>>, GetLifeYearsLost<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetLifeYearsLostResult>>,WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<T,WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & WithCauseImpactChainMethodResult>>, GetSurvivalToAge<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetSurvivalToAgeResult>> {

}
export interface WithDataAndCoxFunctionsAndLifeTableFunctions<T extends object> {
    withData: (data: Data) => WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T>
}
export function getWithDataAndCoxFunctionsAndLifeTableFunctionsResult<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    data: Data,
    cox: Cox
): WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any, memoizedData: any) => {
        return getWithDataAndCoxFunctionsAndLifeTableFunctionsResult(
            nextResult,
            memoizedData,
            data,
            cox
        )
    }

    return Object.assign(
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            cox
        ),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getGetLifeExpectancy(currentResult, getNextObjectInChain),
        getGetLifeYearsLost(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction(
            currentResult,
            getNextObjectInChain
        ),
        getGetSurvivalToAge(currentResult, getNextObjectInChain)
    );
}
export function getWithDataAndCoxFunctionsAndLifeTableFunctions<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    cox: Cox
): WithDataAndCoxFunctionsAndLifeTableFunctions<T> {
    return {
        withData: (data) => {
            return getWithDataAndCoxFunctionsAndLifeTableFunctionsResult(
                currentResult,
                memoizedData,
                data, 
                cox
            );
        }
    };
}

export interface WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & GetRiskToTimeResult>>, GetHealthAge<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & GetHealthAgeResult>>, WithCauseImpactAndCoxFunctions<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & WithCauseImpactChainMethodResult>> {

}
export interface WithDataAndCoxFunctionsAndAddRefPopFunctions<T extends object> {
    withData: (data: Data) => WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T>;
}
export function getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    data: Data, 
    cox: Cox
): WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any, memoizedData: any) => {
        return getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult(
            nextResult,
            memoizedData,
            data, 
            cox
        )
    }

    return Object.assign(
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            cox
        ),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getGetHealthAge(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctions(
            currentResult,
            getNextObjectInChain
        )
    );
}

export function getWithDataAndCoxFunctionsAndAddRefPopFunctions<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    cox: Cox
): WithDataAndCoxFunctionsAndAddRefPopFunctions<T> {
    return {
        withData: (data) => {
            return getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult(
                currentResult,
                memoizedData,
                data, 
                cox
            )
        }
    }
} 

export interface CompleteWithDataResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, CompleteWithDataResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, CompleteWithDataResult<T & GetRiskToTimeResult>>, GetLifeExpectancy<T, CompleteWithDataResult<T & GetLifeExpectancyResult>>, GetLifeYearsLost<T, CompleteWithDataResult<T & GetLifeYearsLostResult>> , GetHealthAge<T, CompleteWithDataResult<T & GetHealthAgeResult>>, WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction<T, CompleteWithDataResult<T & WithCauseImpactChainMethodResult>>, GetSurvivalToAge<T, CompleteWithDataResult<T & GetSurvivalToAgeResult>> {

}

export function getCompleteWithDataResult<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    data: Data,
    cox: Cox
): CompleteWithDataResult<T> {
    const getNextObjectInChain = (nextResult: any, memoizedData: any) => {
        return getCompleteWithDataResult(
            nextResult,
            memoizedData,
            data,
            cox
        );
    }

    return Object.assign(
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            cox
        ),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getGetLifeExpectancy(currentResult, getNextObjectInChain),
        getGetLifeYearsLost(currentResult, getNextObjectInChain),
        getGetHealthAge(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction(
            currentResult,
            getNextObjectInChain
        ),
        getGetSurvivalToAge(currentResult, getNextObjectInChain)
    )
}
export interface CompleteWithData<T extends object> {
        withData: (data: Data) => CompleteWithDataResult<T>
}
export function getCompleteWithData<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    cox: Cox
): CompleteWithData<T> {
    return {
        withData: (data) => {
            return getCompleteWithDataResult(
                currentResult,
                memoizedData,
                data,
                cox
            );
        }
    }
}