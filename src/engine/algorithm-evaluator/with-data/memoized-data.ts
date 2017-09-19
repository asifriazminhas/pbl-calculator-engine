import { CompleteLifeTable } from '../../common/life-table';

export interface WithDataMemoizedData {
    oneYearSurvivalProbability?: number;
    oneYearRiskProbability?: number;
    completeLifeTable?: CompleteLifeTable;
    completeLifeTableForRiskFactors?: {
        [index: string]: CompleteLifeTable | undefined
    },
    oneYearRiskProbabilityForRiskFactors?: {
        [index: string]: number | undefined
    };
    oneYearSurvivalProbabilityForRiskFactors?: {
        [index: string]: number | undefined;
    }
}