import { BaseWithDataResult, getNextObjectInChain } from '../with-data';
import { WithDataMemoizedData } from '../memoized-data';
import { getSurvivalToAge } from '../../../survival-to-age';
import { updateMemoizedData } from './update-memoized-data';
import { RefLifeTable } from '../../../life-table';
import { Data } from '../../../data';
import { ModelTypes, getAlgorithmForModelAndData } from '../../../model';

export interface GetSurvivalToAgeResult {
    survivalToAge: {
        [index: number]: number;
    }
}

export interface GetSurvivalToAge<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToAgeResult>
> {
    getSurvivalToAge: (age: number) => U;
}

export function getGetSurvivalToAge<
    T extends object,
    U extends BaseWithDataResult<T & GetSurvivalToAgeResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetSurvivalToAgeResult, U>,
    currentMemoizedData: WithDataMemoizedData,
    data: Data,
    refLifeTable: RefLifeTable,
    model: ModelTypes,
    useExFromLifeTableFromAge: number = 99
): GetSurvivalToAge<T, U> {
    return {
        getSurvivalToAge: (age) => {
            const cox = getAlgorithmForModelAndData(model, data);
            
            const updatedMemoizedData = updateMemoizedData(
                currentMemoizedData,
                refLifeTable,
                data,
                cox,
                useExFromLifeTableFromAge
            );

            const survivalToAge = getSurvivalToAge(
                updatedMemoizedData.completeLifeTable,
                age
            );

            return getNextObjectInChain(
                Object.assign(
                    {},
                    currentResult,
                    {
                        survivalToAge: Object.assign(
                            {},
                            (currentResult as T & GetSurvivalToAgeResult).survivalToAge,
                            {
                                [age]: survivalToAge
                            }
                        )
                    }
                ),
                updatedMemoizedData
            );
        }
    }
}