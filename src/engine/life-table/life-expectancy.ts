import {
    CompleteLifeTable,
    RefLifeTable,
    getCompleteLifeTableForDataUsingAlgorithm,
} from './life-table';
import { Data, findDatumWithName } from '../data';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 *
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
export function getLifeExpectancyForAge(
    age: number,
    lifeTable: CompleteLifeTable,
): number {
    const lifeTableRowForPassedAge = lifeTable.find(lifeTableRow => {
        return lifeTableRow.age === age;
    });

    if (!lifeTableRowForPassedAge) {
        throw new Error(`No life table row found for age ${age}`);
    } else {
        return lifeTableRowForPassedAge.ex + age;
    }
}

export function getLifeExpectancyUsingRefLifeTable(
    data: Data,
    refLifeTable: RefLifeTable,
    coxAlgorithm: CoxSurvivalAlgorithm,
    useExFromLifeTableFromAge: number = 99,
    completeLifeTable: CompleteLifeTable = getCompleteLifeTableForDataUsingAlgorithm(
        refLifeTable,
        data,
        coxAlgorithm,
        useExFromLifeTableFromAge,
    ),
): number {
    // TODO Change this to have an optional parameter called age
    const ageDatum = findDatumWithName('DHHGAGE', data);

    return getLifeExpectancyForAge(
        ageDatum.coefficent as number,
        completeLifeTable,
    );
}
