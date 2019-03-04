"use strict";
/* tslint:disable:no-shadowed-variable */
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const abridged_life_expectancy_1 = require("../engine/abridged-life-expectancy/abridged-life-expectancy");
const test_utils_1 = require("./test-utils");
const chai_1 = require("chai");
const constants_1 = require("./constants");
test.only(`Life table calculations`, t => {
    t.test(`Abridged life table calculations`, t => {
        // Reference life table
        // tslint:disable-next-line:max-line-length
        const refLifeTable = require(`${constants_1.TestAssetsFolderPath}/life-table/abridged-life-table/ref-abridged-life-table.json`);
        const abridgedLifeExpectancy = new abridged_life_expectancy_1.AbridgedLifeExpectancy({}, refLifeTable);
        // tslint:disable-next-line:max-line-length
        const expectedLifeTable = require(`${constants_1.TestAssetsFolderPath}/life-table/abridged-life-table/male-complete-life-table.json`);
        const actualLifeTable = abridgedLifeExpectancy['getCompleteLifeTable'](refLifeTable.male, 80, [80, 75]);
        expectedLifeTable.forEach((expectedLifeTableRow, index) => {
            chai_1.expect(test_utils_1.getRelativeDifference(actualLifeTable[index].ex, expectedLifeTableRow.ex)).to.be.lessThan(1, `
                    Expected Value: ${expectedLifeTableRow.ex}
                    Actual Value:   ${actualLifeTable[index].ex}
                `);
        });
        t.pass(`Abridged life table correctly calculated`);
        t.end();
    });
});
//# sourceMappingURL=life-expectancy.spec.js.map