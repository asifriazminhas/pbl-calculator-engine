import { WithDataMemoizedData } from '../memoized-data';
import { CompleteLifeTable, RefLifeTable, CompleteLifeTableRow } from '../../../common/life-table';
import { getCompleteLifeTableForDataUsingAlgorithm } from '../../../life-expectancy';
import { Data } from '../../../common/data';
import { Cox } from '../../../cox';
import { Datum } from '../../../common/datum';

export function updateMemoizedData(
    currentMemoizedData: WithDataMemoizedData,
    refLifeTable: RefLifeTable,
    data: Data,
    cox: Cox,
    useExFromLifeTableFromAge: number = 99
): WithDataMemoizedData & {
    completeLifeTable: CompleteLifeTable
} {
    if(!currentMemoizedData.completeLifeTable) {
        currentMemoizedData.completeLifeTable = getCompleteLifeTableForDataUsingAlgorithm(
            refLifeTable,
            data,
            cox,
            useExFromLifeTableFromAge
        );
        if(!currentMemoizedData.oneYearSurvivalProbability) {
            const ageDatum = data
                .find((datum) => datum.coefficent === 'age') as Datum;
            const lifeTableRowForAgeDatum = currentMemoizedData
                .completeLifeTable
                .find((lifeTableRow) => {
                    return lifeTableRow.age === ageDatum.coefficent;
                }) as CompleteLifeTableRow;
            currentMemoizedData.oneYearSurvivalProbability = lifeTableRowForAgeDatum.qx;
            currentMemoizedData.oneYearRiskProbability = 1 - lifeTableRowForAgeDatum.qx;
        }
    }

    return currentMemoizedData as WithDataMemoizedData & {
        completeLifeTable: CompleteLifeTable
    };
}