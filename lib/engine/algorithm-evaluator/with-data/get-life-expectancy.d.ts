import { WithDataAndLifeTableFunctionsFunctionReturn, FullWithDataFunctionReturn } from './with-data';
export interface GetLifeExpectancyResult {
    lifeExpectancy: number;
}
export declare type GetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T> = () => WithDataAndLifeTableFunctionsFunctionReturn<T & GetLifeExpectancyResult>;
export declare function curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions<T extends object>(currentResult: T): GetLifeExpectancyReturnsWithDataAndLifeTableFunctions<T>;
export declare type GetLifeExpectancyReturnsFullWithDataFunction<T> = () => FullWithDataFunctionReturn<T & GetLifeExpectancyResult>;
export declare function curryGetLifeExpectancyReturnsFullWithDataFunction<T extends object>(currentResult: T): GetLifeExpectancyReturnsFullWithDataFunction<T>;
