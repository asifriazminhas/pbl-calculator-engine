import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { getTimeMultiplier } from '../../../cox';
import { WithDataMemoizedData } from '../memoized-data';
import { updateMemoizedData } from './with-data-cox-functions-common';
import { Data } from '../../../data';
import * as moment from 'moment';
import { ModelTypes, getAlgorithmForModelAndData } from '../../../model';

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
    model: ModelTypes,
): GetSurvivalToTime<T, U> {
    return {
        getSurvivalToTime: (time) => {
            const cox = getAlgorithmForModelAndData(model, data);
            
            const updatedMemoizedData = updateMemoizedData(
                memoizedData,
                data,
                cox
            );
            
            let survivalToTime = updatedMemoizedData.oneYearSurvivalProbability;
            if(time) {
                survivalToTime = updatedMemoizedData
                    .oneYearSurvivalProbability*getTimeMultiplier(moment(time));
            }

            return getNextObjectInChain(
                Object.assign({}, currentResult, { survivalToTime }),
                updatedMemoizedData
            );
        }
    }
}
