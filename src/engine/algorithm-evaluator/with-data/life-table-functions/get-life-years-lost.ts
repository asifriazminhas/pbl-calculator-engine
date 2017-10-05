import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { getLifeYearsLost } from '../../../life-years-lost';
import { Data } from '../../../common/data';
import { RefLifeTable, CompleteLifeTable } from '../../../life-table';
import { CauseImpactRef, CauseImpactRefTypes, getCauseImpactRefForData } from '../../../cause-impact';
import { updateMemoizedData } from './update-memoized-data';
import { updateMemoizedData as updateMemoizedDataForCauseImpact, getRiskFactorKey } from '../with-cause-impact'
import { ModelTypes, JsonModelTypes, getAlgorithmJsonForModelAndData, getAlgorithmForModelAndData } from '../../../model';

export interface GetLifeYearsLostResult {
    lifeYearsLost: {
        [index: string]: number;
    };
}

export interface GetLifeYearsLost<
    T extends object,
    U extends BaseWithDataResult<T & GetLifeYearsLostResult>
> {
    getLifeYearsLost: (...riskFactors: string[]) => U;
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
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes,
    useExFromLifeTableFromAge: number = 99
): GetLifeYearsLost<T, U> {
    return {
        getLifeYearsLost: (...riskFactors) => {
            const cox = getAlgorithmForModelAndData(model, data);

            let causeImpactRefToUse: CauseImpactRef;
            if(causeImpactRef) {
                causeImpactRefToUse = getCauseImpactRefForData(
                    causeImpactRef, data
                );
            } else {
                causeImpactRefToUse = getAlgorithmJsonForModelAndData(
                    modelJson, data
                ).causeDeletedRef;
            }

            const updatedMemoizedData = updateMemoizedDataForCauseImpact(
                updateMemoizedData(
                    currentMemoizedData,
                    refLifeTable,
                    data,
                    cox,
                    useExFromLifeTableFromAge
                ),
                refLifeTable,
                riskFactors,
                data,
                causeImpactRefToUse,
                cox,
                useExFromLifeTableFromAge
            );

            const riskFactorKey = getRiskFactorKey(riskFactors);

            const lifeYearsLost = Object.assign(
                {}, 
                (currentResult as T & GetLifeYearsLostResult).lifeYearsLost, 
                {
                    [riskFactorKey]: getLifeYearsLost(
                        causeImpactRefToUse,
                        refLifeTable,
                        cox,
                        data,
                        riskFactors,
                        useExFromLifeTableFromAge,
                        updatedMemoizedData.completeLifeTable,
                        (updatedMemoizedData.completeLifeTableForRiskFactors as { [index: string]: CompleteLifeTable})[riskFactorKey]
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