import { BaseWithDataFunctionReturn, WithDataAndGetHealthAgeFunctionReturn, WithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn } from './with-data';
import * as moment from 'moment';
export interface GetSurvivalToTimeResult {
    survivalToTime: number;
}
export declare type GetSurvivalToTimeReturnsBaseWithDataFunction<T extends object> = (time?: Date | moment.Moment) => BaseWithDataFunctionReturn<T & GetSurvivalToTimeResult>;
export declare function curryGetSurvivalToTimeReturnsBaseWithDataFunction<T extends object>(currentResult: T): GetSurvivalToTimeReturnsBaseWithDataFunction<T>;
export declare type GetSurvivalToTimeReturnsWithDataAndGetHealthAge<T extends object> = (time?: Date | moment.Moment) => WithDataAndGetHealthAgeFunctionReturn<T & GetSurvivalToTimeResult>;
export declare function curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge<T extends object>(currentResult: T): GetSurvivalToTimeReturnsWithDataAndGetHealthAge<T>;
export declare type GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction<T extends object> = (time?: Date | moment.Moment) => WithDataAndLifeTableFunctionsFunctionReturn<T & GetSurvivalToTimeResult>;
export declare function curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy<T extends object>(currentResult: T): GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction<T>;
export declare type GetSurvivalToTimeReturnsFullWithData<T extends object> = (time?: Date | moment.Moment) => FullWithDataFunctionReturn<T & GetSurvivalToTimeResult>;
export declare function curryGetSurvivalToTimeReturnsFullWithData<T extends object>(currentResult: T): GetSurvivalToTimeReturnsFullWithData<T>;
