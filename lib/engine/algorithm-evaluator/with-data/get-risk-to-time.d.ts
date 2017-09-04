import { BaseWithDataFunctionReturn, WithDataAndGetHealthAgeFunctionReturn, WithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn } from './with-data';
import * as moment from 'moment';
export interface GetRiskToTimeResult {
    riskToTime: number;
}
export declare type GetRiskToTimeReturnsBaseWithDataFunction<T extends object> = (time?: Date | moment.Moment) => BaseWithDataFunctionReturn<T & GetRiskToTimeResult>;
export declare function curryGetRiskToTimeReturnsBaseWithDataFunction<T extends object>(currentResult: T): GetRiskToTimeReturnsBaseWithDataFunction<T>;
export declare type GetRiskToTimeReturnsWithDataAndGetHealthAge<T extends object> = (time?: Date | moment.Moment) => WithDataAndGetHealthAgeFunctionReturn<T & GetRiskToTimeResult>;
export declare function curryGetRiskToTimeReturnsWithDataAndGetHealthAge<T extends object>(currentResult: T): GetRiskToTimeReturnsWithDataAndGetHealthAge<T>;
export declare type GeRiskToTimeReturnsWithDataAndGetLifeExpectancy<T extends object> = (time?: Date | moment.Moment) => WithDataAndLifeTableFunctionsFunctionReturn<T & GetRiskToTimeResult>;
export declare function curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy<T extends object>(currentResult: T): GeRiskToTimeReturnsWithDataAndGetLifeExpectancy<T>;
export declare type GetRiskToTimeReturnsFullWithData<T extends object> = (time?: Date | moment.Moment) => FullWithDataFunctionReturn<T & GetRiskToTimeResult>;
export declare function curryGetRiskToTimeReturnsFullWithData<T extends object>(currentResult: T): GetRiskToTimeReturnsFullWithData<T>;
