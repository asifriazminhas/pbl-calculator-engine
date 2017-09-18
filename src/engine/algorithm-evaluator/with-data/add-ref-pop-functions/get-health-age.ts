import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { getHealthAge, ReferencePopulation } from '../../../health-age';
import { Cox, getRiskToTime } from '../../../cox';
import { Data } from '../../../common/data';
import { WithDataMemoizedData } from '../memoized-data';

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
    getNextObjectInChain: getNextObjectInChain<T & GetHealthAgeResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    cox: Cox,
    refPop: ReferencePopulation
): GetHealthAge<T, U> {
    return {
        getHealthAge: () => {
            if(!currentMemoizedData.oneYearRiskProbability) {
                currentMemoizedData.oneYearRiskProbability = getRiskToTime(
                    cox,
                    data
                );
                currentMemoizedData.oneYearSurvivalProbability = 1 - currentMemoizedData.oneYearRiskProbability;
            }

            const healthAge = getHealthAge(
                refPop,
                data,
                cox,
                currentMemoizedData.oneYearRiskProbability
            );

            return getNextObjectInChain(
                Object.assign({}, currentResult, { healthAge }),
                currentMemoizedData
            );
        }
    }
}