import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { updateMemoizedData } from './with-data-cox-functions-common';
import * as moment from 'moment';
import { getTimeMultiplier } from '../../../cox';
import { Data } from '../../../common/data';
import { WithDataMemoizedData } from '../memoized-data';
import { ModelTypes, getAlgorithmForModelAndData } from '../../../model';

export interface GetRiskToTimeResult {
    riskToTime: number;
}

export interface GetRiskToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetRiskToTimeResult>
> {
    getRiskToTime: (time?: Date | moment.Moment) => U;
}

export function getGetRiskToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetRiskToTimeResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetRiskToTimeResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    model: ModelTypes
): GetRiskToTime<T, U> {
    return {
        getRiskToTime: (time) => {
            const cox = getAlgorithmForModelAndData(model, data);
            
            const updatedMemoizedData = updateMemoizedData(
                currentMemoizedData,
                data,
                cox
            );

            let riskToTime = updatedMemoizedData.oneYearSurvivalProbability;
            if(time) {
                riskToTime = updatedMemoizedData
                    .oneYearRiskProbability*getTimeMultiplier(moment(time));
            }

            return getNextObjectInChain(
                Object.assign({}, currentResult, { riskToTime }),
                {}
            )
        }
    }
}