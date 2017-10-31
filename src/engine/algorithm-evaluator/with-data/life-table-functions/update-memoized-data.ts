import { WithDataMemoizedData } from '../memoized-data';
import { CompleteLifeTable, RefLifeTable, CompleteLifeTableRow } from '../../../life-table';
import { getCompleteLifeTableForDataUsingAlgorithm } from '../../../life-expectancy';
import { Data, Datum } from '../../../data';
import { Cox } from '../../../cox';

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