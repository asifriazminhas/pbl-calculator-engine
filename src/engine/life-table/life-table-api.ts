import {
    getCompleteLifeTableForDataUsingAlgorithm,
    getLifeExpectancyForAge,
} from './life-expectancy';
import { getSurvivalToAge } from './survival-to-age';
import { Data, findDatumWithName, updataDataWithDatum } from '../data';
import { RefLifeTable, getCompleteLifeTableWithStartAge } from './life-table';
import { ModelTypes, getAlgorithmForModelAndData } from '../model';
import { getRiskToTime } from '../cox';

export interface ILifeTableApi {
    getLifeExpectancy: (data: Data) => number;
    getSurvivalToAge: (data: Data, age: number) => number;
}

export function getLifeTableFunctions(
    refLifeTable: RefLifeTable,
    model: ModelTypes,
): ILifeTableApi {
    return {
        getLifeExpectancy: data => {
            const algorithmForCurrentData = getAlgorithmForModelAndData(
                model,
                data,
            );
            const completeLifeTable = getCompleteLifeTableForDataUsingAlgorithm(
                refLifeTable,
                data,
                algorithmForCurrentData,
            );

            return getLifeExpectancyForAge(
                findDatumWithName('age', data).coefficent as number,
                completeLifeTable,
            );
        },
        getSurvivalToAge: (data, age) => {
            const algorithmForCurrentData = getAlgorithmForModelAndData(
                model,
                data,
            );

            return getSurvivalToAge(
                getCompleteLifeTableWithStartAge(
                    refLifeTable,
                    ageForRiskToTime => {
                        return getRiskToTime(
                            algorithmForCurrentData,
                            updataDataWithDatum(data, {
                                name: 'age',
                                coefficent: ageForRiskToTime,
                            }),
                        );
                    },
                    findDatumWithName('age', data).coefficent as number,
                ),
                age,
            );
        },
    };
}
