import { BaseWithDataResult } from '../with-data';

export interface GetHealthAgeResult {
    healthAge: number;
}

export interface GetHealthAge<
    T extends object,
    U extends BaseWithDataResult<T & GetHealthAgeResult>
> {
    getHealthAge: () => U;
}

export function getGetHealthAge<
    T extends object,
    U extends BaseWithDataResult<T & GetHealthAgeResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & GetHealthAgeResult) => U
): GetHealthAge<T, U> {
    return {
        getHealthAge: () => {
            const healthAge = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, { healthAge })
            );
        }
    }
}