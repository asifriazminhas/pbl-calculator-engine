"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
const life_table_1 = require("../engine/life-table/life-table");
const path = require("path");
const fs = require("fs");
const chai_1 = require("chai");
const test = require("tape");
test(`LifeTable.getCompleteLifeTableWithStartAge`, t => {
    const testLifeTable = csvParse(fs.readFileSync(path.join(__dirname, '../../assets/test/life-table/life_table.csv'), 'utf8'), {
        columns: true,
    });
    const calculatedLifeTable = life_table_1.getCompleteLifeTableWithStartAge(testLifeTable, age => {
        const ageRowFromTestLifeTable = testLifeTable.find((testLifeTableRow) => {
            return testLifeTableRow.age === age;
        });
        if (!ageRowFromTestLifeTable) {
            throw new Error();
        }
        return 1 - Number(ageRowFromTestLifeTable.qx);
    }, testLifeTable[0].age);
    testLifeTable.forEach((testLifeTableRow, index) => {
        const fields = ['ex'];
        /*fs.writeFileSync(
            path.join(__dirname, '../../assets/calculated-life-table.json'),
            JSON.stringify(this.calculatedLifeTable)
        );*/
        fields.forEach(field => {
            const diff = calculatedLifeTable[index][field] -
                Number(testLifeTableRow[field]);
            const errorPercentage = diff / Number(testLifeTableRow[field]);
            const allowedErrorPercentage = 0.01;
            chai_1.expect(errorPercentage).to.be.lessThan(allowedErrorPercentage, `Row ${index} and field ${field}`);
        });
    });
    t.pass(`should properly calculate the life table fields`);
    t.end();
});
//# sourceMappingURL=life-table.spec.js.map