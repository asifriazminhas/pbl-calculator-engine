import { Data } from '../../../common/data';
import { WithDataMemoizedData } from '../memoized-data';
import { Cox, getSurvivalToTime } from '../../../cox';

export function updateMemoizedData(
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    cox: Cox
): WithDataMemoizedData & {
    oneYearSurvivalProbability: number;
    oneYearRiskProbability: number
} {
    if(!currentMemoizedData.oneYearSurvivalProbability) {
        currentMemoizedData.oneYearSurvivalProbability = getSurvivalToTime(
            cox,
            data
        );
        currentMemoizedData.oneYearRiskProbability = 1 - currentMemoizedData.oneYearSurvivalProbability;
    }
    
    return currentMemoizedData as WithDataMemoizedData & {
        oneYearSurvivalProbability: number;
        oneYearRiskProbability: number
    };
}