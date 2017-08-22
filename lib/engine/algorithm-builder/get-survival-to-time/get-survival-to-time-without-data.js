"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../../cox/cox");
function curryGetSurvivalToTimeWithoutDataAndLifeTable(data, lifeTable) {
    return (time) => {
        const ageDatum = data
            .find(datum => datum.name === 'age');
        if (!ageDatum) {
            throw new Error(`No age datum found`);
        }
        const lifeTableRowForAgeDatum = lifeTable
            .find(lifeTableRow => lifeTableRow.age === ageDatum.coefficent);
        if (!lifeTableRowForAgeDatum) {
            throw new Error(`No life table row found for age ${ageDatum.coefficent}`);
        }
        return cox_1.convertOneYearSurvivalProbabilityToSurvivalProbabilityAtTime(lifeTableRowForAgeDatum.qx, time);
    };
}
exports.curryGetSurvivalToTimeWithoutDataAndLifeTable = curryGetSurvivalToTimeWithoutDataAndLifeTable;
//# sourceMappingURL=get-survival-to-time-without-data.js.map