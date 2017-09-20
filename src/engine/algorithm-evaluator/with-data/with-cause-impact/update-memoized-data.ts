import { WithDataMemoizedData } from '../memoized-data';
import { getCompleteLifeTableForDataUsingAlgorithm } from '../../../life-expectancy';
import { Cox } from '../../../cox';
import { RefLifeTable } from '../../../common/life-table';
import { Data, updateDataWithData } from '../../../common/data';
import { CauseImpactRef } from '../../../cause-impact';

export function updateMemoizedData(
    currentMemoizedData: WithDataMemoizedData,
    refLifeTable: RefLifeTable,
    riskFactors: string[],
    data: Data,
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    useExFromLifeTableFromAge: number = 99
) {
    const riskFactorKey = riskFactors.join('+');

    if(!currentMemoizedData.completeLifeTableForRiskFactors ||currentMemoizedData.completeLifeTableForRiskFactors[riskFactorKey]) {
        currentMemoizedData.completeLifeTableForRiskFactors = Object.assign(
            {},
            currentMemoizedData.completeLifeTableForRiskFactors, 
            {
                [riskFactorKey]: getCompleteLifeTableForDataUsingAlgorithm(
                    refLifeTable,
                    updateDataWithData(
                        data, 
                        causeImpactRef[riskFactorKey]
                    ),
                    cox,
                    useExFromLifeTableFromAge
                )
            }
        )
    }

    return currentMemoizedData;
}