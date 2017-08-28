import { GetSurvivalToTimeReturnsBaseWithDataFunction, curryGetSurvivalToTimeReturnsBaseWithDataFunction,  GetSurvivalToTimeReturnsWithDataAndGetHealthAge, curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge, GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction, curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy, GetSurvivalToTimeReturnsFullWithData, curryGetSurvivalToTimeReturnsFullWithData } from './get-survival-to-time';
import { GetRiskToTimeReturnsBaseWithDataFunction, curryGetRiskToTimeReturnsBaseWithDataFunction, GetRiskToTimeReturnsWithDataAndGetHealthAge, curryGetRiskToTimeReturnsWithDataAndGetHealthAge, GeRiskToTimeReturnsWithDataAndGetLifeExpectancy, curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy, GetRiskToTimeReturnsFullWithData, curryGetRiskToTimeReturnsFullWithData } from './get-risk-to-time';
import { GetLifeExpectancyReturnsFullWithDataFunction, curryGetLifeExpectancyReturnsFullWithDataFunction, GetLifeExpectancyReturnsWithDataAndLifeTableFunctions, curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions } from './get-life-expectancy';
import { GetHealthAgeReturnsWithDataAndGetHealthAgeFunction, curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction, GetHealthAgeReturnsFullWithDataFunction, curryGetHealthAgeReturnsFullWithDataFunction } from './get-health-age';
import { GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction, curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction, GetLifeYearsLostReturnsFullWithData, curryGetLifeYearsLostReturnsFullWithDataFunction } from './get-life-years-lost';

export interface BaseWithDataFunctionReturn<T extends object> {
    end: () => T;
    getSurvivalToTime: GetSurvivalToTimeReturnsBaseWithDataFunction<T>;
    getRiskToTime: GetRiskToTimeReturnsBaseWithDataFunction<T>
}
export type BaseWithDataFunction<T extends object> = () => BaseWithDataFunctionReturn<T>
export interface BaseWithData<T extends object> {
    withData: BaseWithDataFunction<T>;
}
export function getBaseWithDataFunctionReturn<T extends object>(
    currentResult: T
): BaseWithDataFunctionReturn<T> {
    return {
        getSurvivalToTime: curryGetSurvivalToTimeReturnsBaseWithDataFunction(
            currentResult
        ),
        getRiskToTime: curryGetRiskToTimeReturnsBaseWithDataFunction(
            currentResult
        ),
        end: () => {
            return currentResult;
        }
    }
}
export function curryBaseWithDataFunction<T extends object>(
    currentResult: T
): BaseWithDataFunction<T> {
    return () => {
        return getBaseWithDataFunctionReturn(currentResult);
    }
}

export interface WithDataAndLifeTableFunctionsFunctionReturn<T extends object> {
    getSurvivalToTime: GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction<T>;
    getRiskToTime: GeRiskToTimeReturnsWithDataAndGetLifeExpectancy<T>;
    getLifeExpectancy: GetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T>;
    getLifeYearsLost: GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction<T>;
    end: () => T;
}
export function getWithDataAndLifeTableFunctionsFunctionReturn<T extends object>(
    currentResult: T
): WithDataAndLifeTableFunctionsFunctionReturn<T> {
    return {
        getSurvivalToTime: curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy(
            currentResult
        ),
        getRiskToTime: curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy(
            currentResult
        ),
        getLifeExpectancy: curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions(
            currentResult
        ),
        getLifeYearsLost: curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction(
            currentResult
        ),
        end: () => {
            return currentResult;
        }
    }
}

export type WithDataAndLifeTableFunctionsFunction<T extends object> = () => WithDataAndLifeTableFunctionsFunctionReturn<T>;
export interface WithDataAndLifeTableFunctions<T extends object> { 
    withData: WithDataAndLifeTableFunctionsFunction<T>
}
export function curryWithDataAndLifeTableFunctionsFunction<T extends object>(
    currentResult: T
): WithDataAndLifeTableFunctionsFunction<T> {
    return () => {
        return getWithDataAndLifeTableFunctionsFunctionReturn(currentResult);
    }
}

export interface WithDataAndGetHealthAgeFunctionReturn<T extends object> {
    getSurvivalToTime: GetSurvivalToTimeReturnsWithDataAndGetHealthAge<T>;
    getRiskToTime: GetRiskToTimeReturnsWithDataAndGetHealthAge<T>;
    getHealthAge: GetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T>;
    end: () => T
}
export function getWithDataAndGetHealthAgeFunctionReturn<T extends object>(
    currentResult: T
): WithDataAndGetHealthAgeFunctionReturn<T> {
    return {
        getSurvivalToTime: curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge(
            currentResult
        ),
        getRiskToTime: curryGetRiskToTimeReturnsWithDataAndGetHealthAge(
            currentResult
        ),
        getHealthAge: curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction(
            currentResult
        ),
        end: () => {
            return currentResult;
        }
    }
}
export type WithDataAndGetHealthAgeFunction<T extends object> = () => WithDataAndGetHealthAgeFunctionReturn<T>;   
export interface WithDataAndGetHealthAge<T extends object> { 
    withData: WithDataAndGetHealthAgeFunction<T>
}
export function curryWithDataAndGetHealthAgeFunction<T extends object>(
    currentResult: T
): WithDataAndGetHealthAgeFunction<T> {
    return () => {
        return getWithDataAndGetHealthAgeFunctionReturn(currentResult);
    }
}

export interface FullWithDataFunctionReturn<T extends object> {
    getSurvivalToTime: GetSurvivalToTimeReturnsFullWithData<T>;
    getRiskToTime: GetRiskToTimeReturnsFullWithData<T>;
    getLifeExpectancy: GetLifeExpectancyReturnsFullWithDataFunction<T>;
    getHealthAge: GetHealthAgeReturnsFullWithDataFunction<T>;
    getLifeYearsLost: GetLifeYearsLostReturnsFullWithData<T>;
    end: () => T;
}
export function getFullWithDataFunctionReturn<T extends object>(
    currentResult: T
): FullWithDataFunctionReturn<T> {
    return {
        getSurvivalToTime: curryGetSurvivalToTimeReturnsFullWithData(
            currentResult
        ),
        getRiskToTime: curryGetRiskToTimeReturnsFullWithData(
            currentResult
        ),
        getLifeExpectancy: curryGetLifeExpectancyReturnsFullWithDataFunction(
            currentResult
        ),
        getLifeYearsLost: curryGetLifeYearsLostReturnsFullWithDataFunction(
            currentResult
        ),
        getHealthAge: curryGetHealthAgeReturnsFullWithDataFunction(
            currentResult
        ),
        end: () => {
            return currentResult;
        }
    }
}
export type FullWithDataFunction<T extends object> = () => FullWithDataFunctionReturn<T>;
export interface FullWithData<T extends object>{ 
    withData: FullWithDataFunction<T>
}
export function curryFullWithDataFunction<T extends object>(
    currentResult: T
): FullWithDataFunction<T> {
    return () => {
        return getFullWithDataFunctionReturn(currentResult);
    }
}