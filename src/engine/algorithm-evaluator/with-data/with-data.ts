import { End, getEnd } from './end';
import { GetSurvivalToTime, GetSurvivalToTimeResult, getGetSurvivalToTime, GetRiskToTime, GetRiskToTimeResult, getGetRiskToTime } from './cox-functions';
import { GetLifeExpectancy, GetLifeExpectancyResult, getGetLifeExpectancy, GetLifeYearsLost, GetLifeYearsLostResult, getGetLifeYearsLost } from './life-table-functions';
import { GetHealthAge, GetHealthAgeResult, getGetHealthAge } from './add-ref-pop-functions';

export interface BaseWithDataResult<T extends object> extends End<T> {

}
export function getBaseWithDataResult<T extends object>(
    currentResult: T
): BaseWithDataResult<T> {
    return Object.assign({}, getEnd(currentResult));
}

export interface WithDataAndCoxFunctionsResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, WithDataAndCoxFunctionsResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, WithDataAndCoxFunctionsResult<T & GetRiskToTimeResult>> {

}
export interface WithDataAndCoxFunctions<T extends object> {
    withData: () => WithDataAndCoxFunctionsResult<T>;
}
export function getWithDataAndCoxFunctionsResult<
    T extends object
>(
    currentResult: T
): WithDataAndCoxFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any) => {
        return getWithDataAndCoxFunctionsResult(nextResult);
    }

    return Object.assign(
        {},
        getGetSurvivalToTime(currentResult, getNextObjectInChain),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult)
    )
}
export function getWithDataAndCoxFunctions<T extends object>(
    currentResult: T
): WithDataAndCoxFunctions<T> {
    return {
        withData: () => {
            return getWithDataAndCoxFunctionsResult(currentResult);
        }
    }
}

export interface WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetRiskToTimeResult>>, GetLifeExpectancy<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetLifeExpectancyResult>>, GetLifeYearsLost<T, WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T & GetLifeYearsLostResult>> {

}
export interface WithDataAndCoxFunctionsAndLifeTableFunctions<T extends object> {
    withData: () => WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T>
}
export function getWithDataAndCoxFunctionsAndLifeTableFunctionsResult<
    T extends object
>(
    currentResult: T
): WithDataAndCoxFunctionsAndLifeTableFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any) => {
        return getWithDataAndCoxFunctionsAndLifeTableFunctionsResult(
            nextResult
        )
    }

    return Object.assign(
        getGetSurvivalToTime(currentResult, getNextObjectInChain),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getGetLifeExpectancy(currentResult, getNextObjectInChain),
        getGetLifeYearsLost(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult),
    );
}
export function getWithDataAndCoxFunctionsAndLifeTableFunctions<
    T extends object
>(
    currentResult: T
): WithDataAndCoxFunctionsAndLifeTableFunctions<T> {
    return {
        withData: () => {
            return getWithDataAndCoxFunctionsAndLifeTableFunctionsResult(
                currentResult
            );
        }
    };
}

export interface WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & GetRiskToTimeResult>>, GetHealthAge<T, WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T & GetHealthAgeResult>> {

}
export interface WithDataAndCoxFunctionsAndAddRefPopFunctions<T extends object> {
    withData: () => WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T>;
}
export function getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult<
    T extends object
>(
    currentResult: T
): WithDataAndCoxFunctionsAndAddRefPopFunctionsResult<T> {
    const getNextObjectInChain = (nextResult: any) => {
        return getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult(nextResult)
    }

    return Object.assign(
        getGetSurvivalToTime(currentResult, getNextObjectInChain),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getGetHealthAge(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult)
    );
}

export function getWithDataAndCoxFunctionsAndAddRefPopFunctions<
    T extends object
>(
    currentResult: T
): WithDataAndCoxFunctionsAndAddRefPopFunctions<T> {
    return {
        withData: () => {
            return getWithDataAndCoxFunctionsAndAddRefPopFunctionsResult(
                currentResult
            )
        }
    }
} 

export interface CompleteWithDataResult<T extends object> extends BaseWithDataResult<T>, GetSurvivalToTime<T, CompleteWithDataResult<T & GetSurvivalToTimeResult>>, GetRiskToTime<T, CompleteWithDataResult<T & GetRiskToTimeResult>>, GetLifeExpectancy<T, CompleteWithDataResult<T & GetLifeExpectancyResult>>, GetLifeYearsLost<T, CompleteWithDataResult<T & GetLifeYearsLostResult>> , GetHealthAge<T, CompleteWithDataResult<T & GetHealthAgeResult>> {

}

export function getCompleteWithDataResult<
    T extends object
>(
    currentResult: T
): CompleteWithDataResult<T> {
    const getNextObjectInChain = (nextResult: any) => {
        return getCompleteWithDataResult(nextResult);
    }

    return Object.assign(
        getGetSurvivalToTime(currentResult, getNextObjectInChain),
        getGetRiskToTime(currentResult, getNextObjectInChain),
        getGetLifeExpectancy(currentResult, getNextObjectInChain),
        getGetLifeYearsLost(currentResult, getNextObjectInChain),
        getGetHealthAge(currentResult, getNextObjectInChain),
        getBaseWithDataResult(currentResult)
    )
}
export interface CompleteWithData<T extends object> {
        withData: () => CompleteWithDataResult<T>
}
export function getCompleteWithData<
    T extends object
>(
    currentResult: T
): CompleteWithData<T> {
    return {
        withData: () => {
            return getCompleteWithDataResult(currentResult);
        }
    }
}