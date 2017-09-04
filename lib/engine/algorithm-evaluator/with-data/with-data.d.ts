import { GetSurvivalToTimeReturnsBaseWithDataFunction, GetSurvivalToTimeReturnsWithDataAndGetHealthAge, GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction, GetSurvivalToTimeReturnsFullWithData } from './get-survival-to-time';
import { GetRiskToTimeReturnsBaseWithDataFunction, GetRiskToTimeReturnsWithDataAndGetHealthAge, GeRiskToTimeReturnsWithDataAndGetLifeExpectancy, GetRiskToTimeReturnsFullWithData } from './get-risk-to-time';
import { GetLifeExpectancyReturnsFullWithDataFunction, GetLifeExpectancyReturnsWithDataAndLifeTableFunctions } from './get-life-expectancy';
import { GetHealthAgeReturnsWithDataAndGetHealthAgeFunction, GetHealthAgeReturnsFullWithDataFunction } from './get-health-age';
import { GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction, GetLifeYearsLostReturnsFullWithData } from './get-life-years-lost';
import { Data } from '../../common/datum';
export interface BaseWithDataFunctionReturn<T extends object> {
    end: () => T;
    getSurvivalToTime: GetSurvivalToTimeReturnsBaseWithDataFunction<T>;
    getRiskToTime: GetRiskToTimeReturnsBaseWithDataFunction<T>;
}
export declare function getBaseWithDataFunctionReturn<T extends object>(currentResult: T): BaseWithDataFunctionReturn<T>;
export declare type BaseWithDataFunction<T extends object> = (data: Data) => BaseWithDataFunctionReturn<T>;
export interface BaseWithData<T extends object> {
    withData: BaseWithDataFunction<T>;
}
export declare function curryBaseWithDataFunction<T extends object>(currentResult: T): BaseWithDataFunction<T>;
export interface WithDataAndLifeTableFunctionsFunctionReturn<T extends object> {
    getSurvivalToTime: GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction<T>;
    getRiskToTime: GeRiskToTimeReturnsWithDataAndGetLifeExpectancy<T>;
    getLifeExpectancy: GetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T>;
    getLifeYearsLost: GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction<T>;
    end: () => T;
}
export declare function getWithDataAndLifeTableFunctionsFunctionReturn<T extends object>(currentResult: T): WithDataAndLifeTableFunctionsFunctionReturn<T>;
export declare type WithDataAndLifeTableFunctionsFunction<T extends object> = (data: Data) => WithDataAndLifeTableFunctionsFunctionReturn<T>;
export interface WithDataAndLifeTableFunctions<T extends object> {
    withData: WithDataAndLifeTableFunctionsFunction<T>;
}
export declare function curryWithDataAndLifeTableFunctionsFunction<T extends object>(currentResult: T): WithDataAndLifeTableFunctionsFunction<T>;
export interface WithDataAndGetHealthAgeFunctionReturn<T extends object> {
    getSurvivalToTime: GetSurvivalToTimeReturnsWithDataAndGetHealthAge<T>;
    getRiskToTime: GetRiskToTimeReturnsWithDataAndGetHealthAge<T>;
    getHealthAge: GetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T>;
    end: () => T;
}
export declare function getWithDataAndGetHealthAgeFunctionReturn<T extends object>(currentResult: T): WithDataAndGetHealthAgeFunctionReturn<T>;
export declare type WithDataAndGetHealthAgeFunction<T extends object> = (data: Data) => WithDataAndGetHealthAgeFunctionReturn<T>;
export interface WithDataAndGetHealthAge<T extends object> {
    withData: WithDataAndGetHealthAgeFunction<T>;
}
export declare function curryWithDataAndGetHealthAgeFunction<T extends object>(currentResult: T): WithDataAndGetHealthAgeFunction<T>;
export interface FullWithDataFunctionReturn<T extends object> {
    getSurvivalToTime: GetSurvivalToTimeReturnsFullWithData<T>;
    getRiskToTime: GetRiskToTimeReturnsFullWithData<T>;
    getLifeExpectancy: GetLifeExpectancyReturnsFullWithDataFunction<T>;
    getHealthAge: GetHealthAgeReturnsFullWithDataFunction<T>;
    getLifeYearsLost: GetLifeYearsLostReturnsFullWithData<T>;
    end: () => T;
}
export declare function getFullWithDataFunctionReturn<T extends object>(currentResult: T): FullWithDataFunctionReturn<T>;
export declare type FullWithDataFunction<T extends object> = (data: Data) => FullWithDataFunctionReturn<T>;
export interface FullWithData<T extends object> {
    withData: FullWithDataFunction<T>;
}
export declare function curryFullWithDataFunction<T extends object>(currentResult: T): FullWithDataFunction<T>;
