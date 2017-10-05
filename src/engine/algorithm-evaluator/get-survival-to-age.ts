import { getSurvivalToAge } from '../survival-to-age';
import { getCompleteLifeTableWithStartAge, RefLifeTable } from '../life-table';
import { Data } from '../common/datum';
import { getSurvivalToTime } from '../cox';
import { ModelTypes, getAlgorithmForModelAndData } from '../model';

export interface GetSurvivalToAge {
    getSurvivalToAge: (data: Data, age: number) => number;
}

export function getGetSurvivalToAge(
    model: ModelTypes,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): GetSurvivalToAge {
    return {
        getSurvivalToAge: (data: Data, age: number) => {
            const cox = getAlgorithmForModelAndData(
                model, data
            );

            const ageDatum = data
            .find(datum => datum.coefficent === 'age');
            if(!ageDatum) {
                throw new Error(`No datum object found for coefficent age`);
            }

            const dataWithoutAgeDatum = data
                .filter(datum => datum.coefficent === 'age');

            const completeLifeTable = getCompleteLifeTableWithStartAge(
                refLifeTable,
                (age) => {
                    return 1 - getSurvivalToTime(
                        cox,
                        dataWithoutAgeDatum.concat({
                            name: 'age',
                            coefficent: age
                        })
                    );
                },
                ageDatum.coefficent as number,
                useExFromLifeTableFromAge
            ); 

            return getSurvivalToAge(completeLifeTable, age)
        }
    };
}