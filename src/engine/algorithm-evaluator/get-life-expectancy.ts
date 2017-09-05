import { Cox, getSurvivalToTime } from '../cox/cox';
import { getLifeExpectancyForAge } from '../life-expectancy/life-expectancy';
import { RefLifeTable, getCompleteLifeTableWithStartAge } from '../common/life-table';
import { Data } from '../common/datum';

export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}

export function curryGetLifeExpectancyFunction(
    coxAlgorithm: Cox,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancy['getLifeExpectancy'] {
    return (data) => {
        //TODO Change this to have an optional parameter called age
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
                    coxAlgorithm,
                    dataWithoutAgeDatum.concat({
                        name: 'age',
                        coefficent: age
                    })
                );
            },
            ageDatum.coefficent as number,
            useExFromLifeTableFromAge
        );

        return getLifeExpectancyForAge(
            ageDatum.coefficent as number,
            completeLifeTable
        );
    }
}