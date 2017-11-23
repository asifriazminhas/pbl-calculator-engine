import { CompleteLifeTable } from './life-table';

export function getSurvivalToAge(lifeTable: CompleteLifeTable, toAge: number) {
    const startAgelx = lifeTable[0].lx;

    const endAgeLifeTableRow = lifeTable.find(
        lifeTableRow => lifeTableRow.age === toAge,
    );
    if (!endAgeLifeTableRow) {
        throw new Error(`No life table row found for age ${toAge}`);
    }

    return endAgeLifeTableRow.lx / startAgelx;
}
