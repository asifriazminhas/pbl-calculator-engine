import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { getLifeYearsLost } from '../../../life-years-lost';
import { Data } from '../../../common/data';
import { RefLifeTable, CompleteLifeTable } from '../../../common/life-table';
import { Cox } from '../../../cox';
import { CauseImpactRef } from '../../../cause-impact';
import { updateMemoizedData } from './update-memoized-data';
import { updateMemoizedData as updateMemoizedDataForCauseImpact } from '../with-cause-impact'
export interface GetLifeYearsLostResult {
    lifeYearsLost: {
        [index: string]: number;
    };
}

export interface GetLifeYearsLost<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeYearsLostResult>
> {
    getLifeYearsLost: (riskFactor: string) => U;
}

export function getGetLifeYearsLost<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeYearsLostResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetLifeYearsLostResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    refLifeTable: RefLifeTable,
    cox: Cox,
    causeDeletedRef: CauseImpactRef,
    useExFromLifeTableFromAge: number = 99
): GetLifeYearsLost<T, U> {
    return {
        getLifeYearsLost: (riskFactor) => {
            const updatedMemoizedData = updateMemoizedDataForCauseImpact(
                updateMemoizedData(
                    currentMemoizedData,
                    refLifeTable,
                    data,
                    cox,
                    useExFromLifeTableFromAge
                ),
                refLifeTable,
                riskFactor,
                data,
                causeDeletedRef,
                cox,
                useExFromLifeTableFromAge
            );



            const lifeYearsLost = Object.assign(
                {}, 
                (currentResult as T & GetLifeYearsLostResult).lifeYearsLost, 
                {
                    [riskFactor]: getLifeYearsLost(
                        causeDeletedRef,
                        refLifeTable,
                        cox,
                        data,
                        riskFactor,
                        useExFromLifeTableFromAge,
                        updatedMemoizedData.completeLifeTable,
                        (updatedMemoizedData.completeLifeTableForRiskFactors as { [index: string]: CompleteLifeTable})[riskFactor]
                    )
                }
            );

            return getNextObjectInChain(
                Object.assign({}, currentResult, {lifeYearsLost}),
                updatedMemoizedData
            );
        }
    }
}