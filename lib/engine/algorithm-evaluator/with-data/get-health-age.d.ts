import { WithDataAndGetHealthAgeFunctionReturn, FullWithDataFunctionReturn } from './with-data';
export interface GetHealthAgeResult {
    healthAge: number;
}
export declare type GetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T> = () => WithDataAndGetHealthAgeFunctionReturn<T & GetHealthAgeResult>;
export declare function curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T extends object>(currentResult: T): GetHealthAgeReturnsWithDataAndGetHealthAgeFunction<T>;
export declare type GetHealthAgeReturnsFullWithDataFunction<T> = () => FullWithDataFunctionReturn<T & GetHealthAgeResult>;
export declare function curryGetHealthAgeReturnsFullWithDataFunction<T extends object>(currentResult: T): GetHealthAgeReturnsFullWithDataFunction<T>;
