import { WithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn } from './with-data';
export interface GetLifeYearsLostResult {
    lifeYearsLost: {
        [index: string]: number;
    };
}
export declare type GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction<T> = (riskFactor: string) => WithDataAndLifeTableFunctionsFunctionReturn<T & GetLifeYearsLostResult>;
export declare function curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction<T extends object>(currentResult: T): GetLifeYearsLostReturnsWithDataAndLifeTableFunctionsFunction<T>;
export declare type GetLifeYearsLostReturnsFullWithData<T> = (riskFactor: string) => FullWithDataFunctionReturn<T & GetLifeYearsLostResult>;
export declare function curryGetLifeYearsLostReturnsFullWithDataFunction<T extends object>(currentResult: T): GetLifeYearsLostReturnsFullWithData<T>;
