import { WithDataAndLifeTableFunctionsFunctionReturn, getWithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn, getFullWithDataFunctionReturn } from './with-data';

export interface GetLifeYearsLostResult {
    lifeYearsLost: {
        [index: string]: number
    };
}

export type GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction<T> = (
    riskFactor: string
) => WithDataAndLifeTableFunctionsFunctionReturn<T & GetLifeYearsLostResult>;
export function curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction<T extends object>(
    currentResult: T
): GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction<T> {
    return (riskFactor) => {
        //TODO Figure out the any
        const lifeYearsLost = Object.assign(
            {},
            (currentResult as any).lifeYearsLost,
            { [riskFactor]: Math.random() }
        );

        return getWithDataAndLifeTableFunctionsFunctionReturn(
            Object.assign({}, currentResult, { lifeYearsLost })
        )
    }
}

export type GetLifeYearsLostReturnsFullWithData<T> = (
    riskFactor: string
) => FullWithDataFunctionReturn<T & GetLifeYearsLostResult>;
export function curryGetLifeYearsLostReturnsFullWithDataFunction<T extends object>(
    currentResult: T
): GetLifeYearsLostReturnsFullWithData<T> {
    return (riskFactor) => {
        //TODO Figure out the any
        const lifeYearsLost = Object.assign(
            {},
            (currentResult as any).lifeYearsLost,
            { [riskFactor]: Math.random() }
        );

        return getFullWithDataFunctionReturn(
            Object.assign({}, currentResult, { lifeYearsLost })
        )
    }
}