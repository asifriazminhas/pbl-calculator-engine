"use strict";
/* tslint:disable:no-shadowed-variable */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var abridged_life_expectancy_1 = require("../engine/abridged-life-expectancy/abridged-life-expectancy");

var test_utils_1 = require("./test-utils");

var chai_1 = require("chai");

var constants_1 = require("./constants");

test.only("Life table calculations", function (t) {
  t.test("Abridged life table calculations", function (t) {
    // Reference life table
    // tslint:disable-next-line:max-line-length
    var refLifeTable = require("".concat(constants_1.TestAssetsFolderPath, "/life-table/abridged-life-table/ref-abridged-life-table.json"));

    var abridgedLifeExpectancy = new abridged_life_expectancy_1.AbridgedLifeExpectancy({}, refLifeTable); // tslint:disable-next-line:max-line-length

    var expectedLifeTable = require("".concat(constants_1.TestAssetsFolderPath, "/life-table/abridged-life-table/male-complete-life-table.json"));

    var actualLifeTable = abridgedLifeExpectancy['getCompleteLifeTable'](refLifeTable.male, 80, [80, 75]);
    expectedLifeTable.forEach(function (expectedLifeTableRow, index) {
      chai_1.expect(test_utils_1.getRelativeDifference(actualLifeTable[index].ex, expectedLifeTableRow.ex)).to.be.lessThan(1, "\n                    Expected Value: ".concat(expectedLifeTableRow.ex, "\n                    Actual Value:   ").concat(actualLifeTable[index].ex, "\n                "));
    });
    t.pass("Abridged life table correctly calculated");
    t.end();
  });
});
//# sourceMappingURL=life-expectancy.spec.js.map