import { BaseWithDataResult, getNextObjectInChain } from '../with-data';

export interface GetLifeExpectancyResult {
    lifeExpectancy: number;
}

export interface GetLifeExpectancy<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeExpectancyResult>
> {
    getLifeExpectancy: () => U;
}

export function getGetLifeExpectancy<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeExpectancyResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetLifeExpectancyResult, U>
): GetLifeExpectancy<T, U> {
    return {
        getLifeExpectancy: () => {
            const lifeExpectancy = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, { lifeExpectancy }),
                {}
            );
        }
    }
}