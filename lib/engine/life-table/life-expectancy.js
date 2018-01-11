"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_table_1 = require("./life-table");
const data_1 = require("../data");
const cox_1 = require("../cox");
/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 *
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
function getLifeExpectancyForAge(age, lifeTable) {
    const lifeTableRowForPassedAge = lifeTable.find(lifeTableRow => {
        return lifeTableRow.age === age;
    });
    if (!lifeTableRowForPassedAge) {
        throw new Error(`No life table row found for age ${age}`);
    }
    else {
        return lifeTableRowForPassedAge.ex + age;
    }
}
exports.getLifeExpectancyForAge = getLifeExpectancyForAge;
function getCompleteLifeTableForDataUsingAlgorithm(refLifeTable, data, cox, useExFromLifeTableFromAge = 99) {
    // TODO Change this to have an optional parameter called age
    const ageDatum = data_1.findDatumWithName('age', data);
    const dataWithoutAgeDatum = data.filter(datum => datum.name !== 'age');
    return life_table_1.getCompleteLifeTableWithStartAge(refLifeTable, age => {
        return (1 -
            cox_1.getSurvivalToTime(cox, dataWithoutAgeDatum.concat({
                name: 'age',
                coefficent: age,
            })));
    }, ageDatum.coefficent, useExFromLifeTableFromAge);
}
exports.getCompleteLifeTableForDataUsingAlgorithm = getCompleteLifeTableForDataUsingAlgorithm;
function getLifeExpectancyUsingRefLifeTable(data, refLifeTable, coxAlgorithm, useExFromLifeTableFromAge = 99, completeLifeTable = getCompleteLifeTableForDataUsingAlgorithm(refLifeTable, data, coxAlgorithm, useExFromLifeTableFromAge)) {
    // TODO Change this to have an optional parameter called age
    const ageDatum = data_1.findDatumWithName('age', data);
    return getLifeExpectancyForAge(ageDatum.coefficent, completeLifeTable);
}
exports.getLifeExpectancyUsingRefLifeTable = getLifeExpectancyUsingRefLifeTable;
//# sourceMappingURL=life-expectancy.js.map