import { BaseWithDataResult } from '../with-data';

export interface GetLifeYearsLostResult {
    lifeYearsLost: {
        [index: string]: number;
    };
}

export interface GetLifeYearsLost<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeYearsLostResult>
> {
    getLifeYearsLost: () => U;
}

export function getGetLifeYearsLost<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeYearsLostResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & GetLifeYearsLostResult) => U
): GetLifeYearsLost<T, U> {
    return {
        getLifeYearsLost: () => {
            const lifeYearsLost = {
                'test': Math.random()
            };

            return getNextObjectInChain(
                Object.assign({}, currentResult, { lifeYearsLost })
            );
        }
    }
}