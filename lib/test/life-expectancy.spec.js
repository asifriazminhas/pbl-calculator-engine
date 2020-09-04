"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _abridgedLifeExpectancy = require("../engine/abridged-life-expectancy/abridged-life-expectancy");

var _testUtils = require("./test-utils");

var _chai = require("chai");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tslint:disable:no-shadowed-variable */
(0, _tape.default)("Life table calculations", function (t) {
  t.test("Abridged life table calculations", function (t) {
    // Reference life table
    // tslint:disable-next-line:max-line-length
    var refLifeTable = require("".concat(_constants.TestAssetsFolderPath, "/life-table/abridged-life-table/ref-abridged-life-table.json"));

    var abridgedLifeExpectancy = new _abridgedLifeExpectancy.AbridgedLifeExpectancy({}, refLifeTable); // tslint:disable-next-line:max-line-length

    var expectedLifeTable = require("".concat(_constants.TestAssetsFolderPath, "/life-table/abridged-life-table/male-complete-life-table.json"));

    var actualLifeTable = abridgedLifeExpectancy['getCompleteLifeTable'](refLifeTable.male, 80);
    expectedLifeTable.forEach(function (expectedLifeTableRow, index) {
      (0, _chai.expect)((0, _testUtils.getRelativeDifference)(actualLifeTable[index].ex, expectedLifeTableRow.ex)).to.be.lessThan(1, "\n                    Expected Value: ".concat(expectedLifeTableRow.ex, "\n                    Actual Value:   ").concat(actualLifeTable[index].ex, "\n                "));
    });
    t.pass("Abridged life table correctly calculated");
    t.end();
  });
});
//# sourceMappingURL=life-expectancy.spec.js.map