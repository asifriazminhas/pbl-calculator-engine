import { WithDataMemoizedData } from '../memoized-data';
import { getCompleteLifeTableForDataUsingAlgorithm } from '../../../life-expectancy';
import { Cox } from '../../../cox';
import { RefLifeTable } from '../../../common/life-table';
import { Data, updateDataWithData } from '../../../common/data';
import { CauseImpactRef } from '../../../cause-impact';

export function updateMemoizedData(
    currentMemoizedData: WithDataMemoizedData,
    refLifeTable: RefLifeTable,
    riskFactor: string,
    data: Data,
    causeDeletedRef: CauseImpactRef,
    cox: Cox,
    useExFromLifeTableFromAge: number = 99
) {
    if(!currentMemoizedData.completeLifeTableForRiskFactors ||currentMemoizedData.completeLifeTableForRiskFactors[riskFactor]) {
        currentMemoizedData.completeLifeTableForRiskFactors = Object.assign(
            {},
            currentMemoizedData.completeLifeTableForRiskFactors, 
            {
                [riskFactor]: getCompleteLifeTableForDataUsingAlgorithm(
                    refLifeTable,
                    updateDataWithData(
                        data, 
                        causeDeletedRef[riskFactor]
                    ),
                    cox,
                    useExFromLifeTableFromAge
                )
            }
        )
    }

    return currentMemoizedData;
}