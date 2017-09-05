import { WithDataAndLifeTableFunctionsFunctionReturn, getWithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn, getFullWithDataFunctionReturn } from './with-data';

export interface GetLifeExpectancyResult {
    lifeExpectancy: number;
}

export type GetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T> = () => WithDataAndLifeTableFunctionsFunctionReturn<T & GetLifeExpectancyResult>;
export function curryGetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T extends object>(
    currentResult: T
): GetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T> {
    return () => {
        const lifeExpectancy = Math.random();

        return getWithDataAndLifeTableFunctionsFunctionReturn(
            Object.assign({}, currentResult, { lifeExpectancy })
        );
    }
}

export type GetLifeExpectancyReturnsFullWithDataFunction<T> = () => FullWithDataFunctionReturn<T & GetLifeExpectancyResult>;
export function curryGetLifeExpectancyReturnsFullWithDataFunction<T extends object>(
    currentResult: T
): GetLifeExpectancyReturnsFullWithDataFunction<T> {
    return () => {
        const lifeExpectancy = Math.random();

        return getFullWithDataFunctionReturn(
            Object.assign({}, currentResult, { lifeExpectancy })
        );
    }
}