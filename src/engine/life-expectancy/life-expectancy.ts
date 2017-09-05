import { CompleteLifeTable } from '../common/life-table';

/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 * 
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
export function getLifeExpectancyForAge(
    age: number, 
    lifeTable: CompleteLifeTable
): number {
    const lifeTableRowForPassedAge = lifeTable.find((lifeTableRow) => {
        return lifeTableRow.age === age;
    });

    if(!lifeTableRowForPassedAge) {
        throw new Error(`No life table row found for age ${age}`);
    }
    else {
        return lifeTableRowForPassedAge.ex + age;
    }
}