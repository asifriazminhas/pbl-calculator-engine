"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getSurvivalToAge(lifeTable, toAge) {
    const startAgelx = lifeTable[0].lx;
    const endAgeLifeTableRow = lifeTable.find(lifeTableRow => lifeTableRow.age === toAge);
    if (!endAgeLifeTableRow) {
        throw new Error(`No life table row found for age ${toAge}`);
    }
    return endAgeLifeTableRow.lx / startAgelx;
}
exports.getSurvivalToAge = getSurvivalToAge;
//# sourceMappingURL=survival-to-age.js.map