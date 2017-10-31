import { End, getEnd } from './end';
import { GetSurvivalToTime, GetSurvivalToTimeResult, getGetSurvivalToTime, GetRiskToTime, GetRiskToTimeResult, getGetRiskToTime } from './cox-functions';
import { GetLifeExpectancy, GetLifeExpectancyResult, getGetLifeExpectancy, GetLifeYearsLost, GetLifeYearsLostResult, getGetLifeYearsLost, GetSurvivalToAge, GetSurvivalToAgeResult, getGetSurvivalToAge } from './life-table-functions';
import { GetHealthAge, GetHealthAgeResult, getGetHealthAge } from './add-ref-pop-functions';
import { WithCauseImpactAndCoxFunctions, getWithCauseImpactAndCoxFunctions, WithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction, WithCauseImpactChainMethodResult } from './with-cause-impact';
import { WithDataMemoizedData } from './memoized-data';
import { Data } from '../../data';
import { ReferencePopulation } from '../../health-age';
import { RefLifeTable } from '../../life-table';
import { CauseImpactRefTypes } from '../../cause-impact';
import { ModelTypes, JsonModelTypes } from '../../model';

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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes
): WithDataAndCoxFunctionsResult<T> {
    const getNextObjectInChain = (
        nextResult: any,
        memoizedData: any
    ) => {
        return getWithDataAndCoxFunctionsResult(
            nextResult, 
            memoizedData,
            data,
            model,
            modelJson,
            causeImpactRef
        );
    }

    return Object.assign(
        {},
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain, 
            memoizedData,
            data,
            model
        ),
        getGetRiskToTime(
            currentResult, 
            getNextObjectInChain, 
            memoizedData,
            data, 
            model
        ),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctions(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model,
            modelJson,
            causeImpactRef
        )
    )
}
export function getWithDataAndCoxFunctions<T extends object>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes
): WithDataAndCoxFunctions<T> {
    return {
        withData: (data) => {
            return getWithDataAndCoxFunctionsResult(
                currentResult,
                memoizedData,
                data,
                model,
                modelJson,
                causeImpactRef
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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refLifeTable: RefLifeTable,
    causeImpactRef?: CauseImpactRefTypes,
    useExFromLifeTableFromAge: number = 99
): WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any, memoizedData: any) => {
        return getWithDataAndCoxFunctionsAndLifeTableFunctionsResult(
            nextResult,
            memoizedData,
            data,
            model,
            modelJson,
            refLifeTable,
            causeImpactRef,
            useExFromLifeTableFromAge
        )
    }

    return Object.assign(
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model
        ),
        getGetRiskToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model
        ),
        getGetLifeExpectancy(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model,
            useExFromLifeTableFromAge
        ),
        getGetLifeYearsLost(
            currentResult, 
            getNextObjectInChain, 
            memoizedData,
            data,
            refLifeTable,
            model,
            modelJson,
            causeImpactRef,
            useExFromLifeTableFromAge
        ),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction(
            currentResult,
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model,
            modelJson,
            causeImpactRef,
            useExFromLifeTableFromAge
        ),
        getGetSurvivalToAge(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model,
            useExFromLifeTableFromAge,
        )
    );
}
export function getWithDataAndCoxFunctionsAndLifeTableFunctions<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refLifeTable: RefLifeTable,
    causeImpactRef?: CauseImpactRefTypes,
    useExFromLifeTableFromAge: number = 99
): WithDataAndCoxFunctionsAndLifeTableFunctions<T> {
    return {
        withData: (data) => {
            return getWithDataAndCoxFunctionsAndLifeTableFunctionsResult(
                currentResult,
                memoizedData,
                data, 
                model,
                modelJson,
                refLifeTable,
                causeImpactRef,
                useExFromLifeTableFromAge
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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    causeImpactRef?: CauseImpactRefTypes
): WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any, memoizedData: any) => {
        return getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult(
            nextResult,
            memoizedData,
            data, 
            model,
            modelJson,
            refPop,
            causeImpactRef
        )
    }

    return Object.assign(
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model
        ),
        getGetRiskToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model
        ),
        getGetHealthAge(
            currentResult, 
            getNextObjectInChain, 
            memoizedData,
            data,
            model,
            refPop
        ),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctions(
            currentResult,
            getNextObjectInChain,
            memoizedData,
            data,
            model,
            modelJson,
            causeImpactRef
        )
    );
}

export function getWithDataAndCoxFunctionsAndAddRefPopFunctions<
    T extends object
>(
    currentResult: T,
    memoizedData: WithDataMemoizedData,
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    causeImpactRef?: CauseImpactRefTypes
): WithDataAndCoxFunctionsAndAddRefPopFunctions<T> {
    return {
        withData: (data) => {
            return getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult(
                currentResult,
                memoizedData,
                data, 
                model,
                modelJson,
                refPop,
                causeImpactRef
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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    refLifeTable: RefLifeTable,
    causeImpactRef?: CauseImpactRefTypes,
    useExFromLifeTableFromAge: number = 99
): CompleteWithDataResult<T> {
    const getNextObjectInChain = (nextResult: any, memoizedData: any) => {
        return getCompleteWithDataResult(
            nextResult,
            memoizedData,
            data,
            model,
            modelJson,
            refPop,
            refLifeTable,
            causeImpactRef,
            useExFromLifeTableFromAge
        );
    }

    return Object.assign(
        getGetSurvivalToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model
        ),
        getGetRiskToTime(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            model
        ),
        getGetLifeExpectancy(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model
        ),
        getGetLifeYearsLost(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model,
            modelJson,
            causeImpactRef,
            useExFromLifeTableFromAge
        ),
        getGetHealthAge(
            currentResult, 
            getNextObjectInChain, 
            memoizedData,
            data,
            model,
            refPop
        ),
        getBaseWithDataResult(currentResult),
        getWithCauseImpactAndCoxFunctionsAndLifeExpectancyFunction(
            currentResult,
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model,
            modelJson,
            causeImpactRef,
            useExFromLifeTableFromAge
        ),
        getGetSurvivalToAge(
            currentResult, 
            getNextObjectInChain,
            memoizedData,
            data,
            refLifeTable,
            model,
            useExFromLifeTableFromAge
        )
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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    refLifeTable: RefLifeTable,
    causeImpactRef?: CauseImpactRefTypes,
    useExFromLifeTableFromAge: number = 99
): CompleteWithData<T> {
    return {
        withData: (data) => {
            return getCompleteWithDataResult(
                currentResult,
                memoizedData,
                data,
                model,
                modelJson,
                refPop,
                refLifeTable,
                causeImpactRef,
                useExFromLifeTableFromAge
            );
        }
    }
}