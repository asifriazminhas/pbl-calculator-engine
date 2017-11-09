import { CompleteLifeTable } from '../life-table';

export function getSurvivalToAge(lifeTable: CompleteLifeTable, age: number) {
    const startAgelx = lifeTable[0].lx;

    const endAgeLifeTableRow = lifeTable.find(
        lifeTableRow => lifeTableRow.age === age,
    );
    if (!endAgeLifeTableRow) {
        throw new Error(`No life table row found for age ${age}`);
    }

    return endAgeLifeTableRow.lx / startAgelx;
}
