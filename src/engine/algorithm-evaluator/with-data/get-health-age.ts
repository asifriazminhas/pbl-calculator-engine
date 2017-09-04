import { WithDataAndGetHealthAgeFunctionReturn, getWithDataAndGetHealthAgeFunctionReturn, FullWithDataFunctionReturn, getFullWithDataFunctionReturn } from './with-data';

export interface GetHealthAgeResult {
    healthAge: number;
}

export type GetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T> = () => WithDataAndGetHealthAgeFunctionReturn<T & GetHealthAgeResult>;
export function curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T extends object>(
    currentResult: T
): GetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T> {
    return () => {
        const healthAge = Math.random();

        return getWithDataAndGetHealthAgeFunctionReturn(
            Object.assign({}, currentResult, { healthAge })
        );
    }
}

export type GetHealthAgeReturnsFullWithDataFunction<T> = () => FullWithDataFunctionReturn<T & GetHealthAgeResult>;
export function curryGetHealthAgeReturnsFullWithDataFunction<T extends object>(
    currentResult: T
): GetHealthAgeReturnsFullWithDataFunction<T> {
    return () => {
        const healthAge = Math.random();

        return getFullWithDataFunctionReturn(
            Object.assign({}, currentResult, { healthAge })
        );
    }
}
