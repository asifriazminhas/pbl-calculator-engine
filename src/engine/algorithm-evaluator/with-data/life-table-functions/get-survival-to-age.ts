import { BaseWithDataResult } from '../with-data';

export interface GetSurvivalToAgeResult {
    survivalToAge: {
        [index: number]: number;
    }
}

export interface GetSurvivalToAge<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToAgeResult>
> {
    getSurvivalToAge: () => U;
}

export function getGetSurvivalToAge<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToAgeResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & GetSurvivalToAgeResult) => U
): GetSurvivalToAge<T, U> {
    return {
        getSurvivalToAge: () => {
            const survivalToAge = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, {
                    survivalToAge: {
                        [1]: survivalToAge
                    }
                })
            )
        }
    }
}