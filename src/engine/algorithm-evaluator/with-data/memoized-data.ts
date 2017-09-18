import { CompleteLifeTable } from '../../common/life-table';

export interface WithDataMemoizedData {
    oneYearSurvivalProbability?: number;
    oneYearRiskProbability?: number;
    completeLifeTable?: CompleteLifeTable;
}