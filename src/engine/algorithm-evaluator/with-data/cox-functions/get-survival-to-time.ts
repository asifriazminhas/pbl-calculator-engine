import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { getSurvivalToTime, Cox, getTimeMultiplier } from '../../../cox';
import { WithDataMemoizedData } from '../memoized-data';
import { Data } from '../../../common/data';
import * as moment from 'moment';

export interface GetSurvivalToTimeResult {
    survivalToTime: number;
}

export interface GetSurvivalToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToTimeResult>
> {
    getSurvivalToTime: (time?: Date | moment.Moment) => U;
}

export function getGetSurvivalToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToTimeResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetSurvivalToTimeResult, U>,
    memoizedData: WithDataMemoizedData,
    data: Data,
    cox: Cox,
): GetSurvivalToTime<T, U> {
    return {
        getSurvivalToTime: (time) => {
            if(!memoizedData.oneYearSurvivalProbability) {
                memoizedData.oneYearSurvivalProbability = getSurvivalToTime(
                    cox,
                    data
                );
                memoizedData.oneYearRiskProbability = 1 - memoizedData.oneYearSurvivalProbability;
            }
            
            let survivalToTime = memoizedData.oneYearSurvivalProbability;
            if(time) {
                survivalToTime = memoizedData.oneYearSurvivalProbability*getTimeMultiplier(
                    moment(time)
                );
            }

            return getNextObjectInChain(
                Object.assign({}, currentResult, { survivalToTime }),
                memoizedData
            );
        }
    }
}
