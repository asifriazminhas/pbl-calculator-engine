import { BaseWithDataFunctionReturn, getBaseWithDataFunctionReturn, WithDataAndGetHealthAgeFunctionReturn, getWithDataAndGetHealthAgeFunctionReturn,WithDataAndLifeTableFunctionsFunctionReturn, getWithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn, getFullWithDataFunctionReturn } from './with-data';

import * as moment from 'moment';

export interface GetRiskToTimeResult {
    riskToTime: number
}

export type GetRiskToTimeReturnsBaseWithDataFunction<T extends object> = (
    time?: Date | moment.Moment
) => BaseWithDataFunctionReturn<T & GetRiskToTimeResult>;
export function curryGetRiskToTimeReturnsBaseWithDataFunction<T extends object>(
    currentResult: T
): GetRiskToTimeReturnsBaseWithDataFunction<T> {
    return (time) => {
        time;

        const riskToTime = Math.random();

        return getBaseWithDataFunctionReturn(
            Object.assign({}, currentResult, { riskToTime })
        );
    }
}

export type GetRiskToTimeReturnsWithDataAndGetHealthAge<T extends object> = (
    time?: Date | moment.Moment
) => WithDataAndGetHealthAgeFunctionReturn<T & GetRiskToTimeResult>;
export function curryGetRiskToTimeReturnsWithDataAndGetHealthAge<T extends object>(
    currentResult: T
): GetRiskToTimeReturnsWithDataAndGetHealthAge<T> {
    return (time) => {
        time;

        const riskToTime = Math.random();

        return getWithDataAndGetHealthAgeFunctionReturn(
            Object.assign({}, currentResult, { riskToTime })
        );
    }
}

export type GeRiskToTimeReturnsWithDataAndGetLifeExpectancy<T extends object> = (
    time?: Date | moment.Moment
) => WithDataAndLifeTableFunctionsFunctionReturn<T & GetRiskToTimeResult>;
export function curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy<T extends object>(
    currentResult: T
): GeRiskToTimeReturnsWithDataAndGetLifeExpectancy<T> {
    return (time) => {
        time;

        const riskToTime = Math.random();

        return getWithDataAndLifeTableFunctionsFunctionReturn(
            Object.assign({}, currentResult, { riskToTime })
        );
    }
}

export type GetRiskToTimeReturnsFullWithData<T extends object> = (
    time?: Date | moment.Moment
) => FullWithDataFunctionReturn<T & GetRiskToTimeResult>;
export function curryGetRiskToTimeReturnsFullWithData<T extends object>(
    currentResult: T
): GetRiskToTimeReturnsFullWithData<T> {
    return (time) => {
        time;

        const riskToTime = Math.random();

        return getFullWithDataFunctionReturn(
            Object.assign({}, currentResult, { riskToTime })
        );
    }
}