import { CompleteLifeTable, getCompleteLifeTableWithStartAge, RefLifeTable } from '../life-table';
import { Data } from '../data';
import { Cox, getSurvivalToTime } from '../cox';

/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 * 
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
function getLifeExpectancyForAge(
    age: number,
    lifeTable: CompleteLifeTable
): number {
    const lifeTableRowForPassedAge = lifeTable.find((lifeTableRow) => {
        return lifeTableRow.age === age;
    });

    if (!lifeTableRowForPassedAge) {
        throw new Error(`No life table row found for age ${age}`);
    }
    else {
        return lifeTableRowForPassedAge.ex + age;
    }
}


export function getCompleteLifeTableForDataUsingAlgorithm(
    refLifeTable: RefLifeTable,
    data: Data,
    cox: Cox,
    useExFromLifeTableFromAge: number = 99
): CompleteLifeTable {
    //TODO Change this to have an optional parameter called age
    const ageDatum = data
        .find(datum => datum.coefficent === 'age');
    if (!ageDatum) {
        throw new Error(`No datum object found for coefficent age`);
    }

    const dataWithoutAgeDatum = data
        .filter(datum => datum.coefficent === 'age');

    return getCompleteLifeTableWithStartAge(
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
}

export function getLifeExpectancyUsingRefLifeTable(
    data: Data,
    refLifeTable: RefLifeTable,
    coxAlgorithm: Cox,
    useExFromLifeTableFromAge: number = 99,
    completeLifeTable: CompleteLifeTable = getCompleteLifeTableForDataUsingAlgorithm(
        refLifeTable,
        data,
        coxAlgorithm,
        useExFromLifeTableFromAge
    )
): number {
    //TODO Change this to have an optional parameter called age
    const ageDatum = data
        .find(datum => datum.coefficent === 'age');
    if (!ageDatum) {
        throw new Error(`No datum object found for coefficent age`);
    }

    return getLifeExpectancyForAge(
        ageDatum.coefficent as number,
        completeLifeTable
    );
}