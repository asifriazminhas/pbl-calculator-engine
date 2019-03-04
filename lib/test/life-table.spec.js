"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:disable-next-line

var csvParse = require('csv-parse/lib/sync');

var life_table_1 = require("../engine/life-table/life-table");

var path = require("path");

var fs = require("fs");

var chai_1 = require("chai");

var test = require("tape");

test("LifeTable.getCompleteLifeTableWithStartAge", function (t) {
  var testLifeTable = csvParse(fs.readFileSync(path.join(__dirname, '../../assets/test/life-table/life_table.csv'), 'utf8'), {
    columns: true
  });
  var calculatedLifeTable = life_table_1.getCompleteLifeTableWithStartAge(testLifeTable, function (age) {
    var ageRowFromTestLifeTable = testLifeTable.find(function (testLifeTableRow) {
      return testLifeTableRow.age === age;
    });

    if (!ageRowFromTestLifeTable) {
      throw new Error();
    }

    return 1 - Number(ageRowFromTestLifeTable.qx);
  }, testLifeTable[0].age);
  testLifeTable.forEach(function (testLifeTableRow, index) {
    var fields = ['ex'];
    /*fs.writeFileSync(
        path.join(__dirname, '../../assets/calculated-life-table.json'),
        JSON.stringify(this.calculatedLifeTable)
    );*/

    fields.forEach(function (field) {
      var diff = calculatedLifeTable[index][field] - Number(testLifeTableRow[field]);
      var errorPercentage = diff / Number(testLifeTableRow[field]);
      var allowedErrorPercentage = 0.01;
      chai_1.expect(errorPercentage).to.be.lessThan(allowedErrorPercentage, "Row ".concat(index, " and field ").concat(field));
    });
  });
  t.pass("should properly calculate the life table fields");
  t.end();
});
//# sourceMappingURL=life-table.spec.js.map