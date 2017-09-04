import { BaseWithDataFunctionReturn, getBaseWithDataFunctionReturn, WithDataAndGetHealthAgeFunctionReturn, getWithDataAndGetHealthAgeFunctionReturn,WithDataAndLifeTableFunctionsFunctionReturn, getWithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn, getFullWithDataFunctionReturn } from './with-data';
import * as moment from 'moment';

export interface GetSurvivalToTimeResult {
    survivalToTime: number
}

export type GetSurvivalToTimeReturnsBaseWithDataFunction<T extends object> = (
    time?: Date | moment.Moment
) => BaseWithDataFunctionReturn<T & GetSurvivalToTimeResult>;
export function curryGetSurvivalToTimeReturnsBaseWithDataFunction<T extends object>(
    currentResult: T
): GetSurvivalToTimeReturnsBaseWithDataFunction<T> {
    return (time) => {
        time;

        const survivalToTime = Math.random();

        return getBaseWithDataFunctionReturn(
            Object.assign({}, currentResult, { survivalToTime })
        )
    }
}

export type GetSurvivalToTimeReturnsWithDataAndGetHealthAge<T extends object> = (
    time?: Date | moment.Moment
) => WithDataAndGetHealthAgeFunctionReturn<T & GetSurvivalToTimeResult>;
export function curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge<T extends object>(
    currentResult: T
): GetSurvivalToTimeReturnsWithDataAndGetHealthAge<T> {
    return (time) => {
        time;

        const survivalToTime = Math.random();

        return getWithDataAndGetHealthAgeFunctionReturn(
            Object.assign({}, currentResult, { survivalToTime })
        );
    }
}

export type GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction<T extends object> = (
    time?: Date | moment.Moment
) => WithDataAndLifeTableFunctionsFunctionReturn<T & GetSurvivalToTimeResult>;
export function curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy<T extends object>(
    currentResult: T
): GetSurvivalToTimeReturnsWithDataAndLifeTableFunctionsFunction<T> {
    return (time) => {
        time;

        const survivalToTime = Math.random();

        return getWithDataAndLifeTableFunctionsFunctionReturn(
            Object.assign({}, currentResult, { survivalToTime })
        );
    }
}

export type GetSurvivalToTimeReturnsFullWithData<T extends object> = (
    time?: Date | moment.Moment
) => FullWithDataFunctionReturn<T & GetSurvivalToTimeResult>;
export function curryGetSurvivalToTimeReturnsFullWithData<T extends object>(
    currentResult: T
): GetSurvivalToTimeReturnsFullWithData<T> {
    return (time) => {
        time;

        const survivalToTime = Math.random();

        return getFullWithDataFunctionReturn(
            Object.assign({}, currentResult, { survivalToTime })
        );
    }
}