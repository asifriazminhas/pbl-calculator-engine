import { BaseWithDataResult } from '../with-data';

export interface GetSurvivalToTimeResult {
    survivalToTime: number;
}

export interface GetSurvivalToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToTimeResult>
> {
    getSurvivalToTime: () => U;
}

export function getGetSurvivalToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToTimeResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & GetSurvivalToTimeResult) => U
): GetSurvivalToTime<T, U> {
    return {
        getSurvivalToTime: () => {
            const survivalToTime = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, { survivalToTime })
            );
        }
    }
}
