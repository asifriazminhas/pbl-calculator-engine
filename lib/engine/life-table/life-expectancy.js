"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLifeExpectancyForAge = getLifeExpectancyForAge;
exports.getLifeExpectancyUsingRefLifeTable = getLifeExpectancyUsingRefLifeTable;

var _lifeTable = require("./life-table");

var _data = require("../data");

/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 *
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
function getLifeExpectancyForAge(age, lifeTable) {
  var lifeTableRowForPassedAge = lifeTable.find(function (lifeTableRow) {
    return lifeTableRow.age === age;
  });

  if (!lifeTableRowForPassedAge) {
    throw new Error("No life table row found for age ".concat(age));
  } else {
    return lifeTableRowForPassedAge.ex + age;
  }
}

function getLifeExpectancyUsingRefLifeTable(data, refLifeTable, coxAlgorithm) {
  var useExFromLifeTableFromAge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 99;
  var completeLifeTable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : (0, _lifeTable.getCompleteLifeTableForDataUsingAlgorithm)(refLifeTable, data, coxAlgorithm, useExFromLifeTableFromAge);
  // TODO Change this to have an optional parameter called age
  var ageDatum = (0, _data.findDatumWithName)('age', data);
  return getLifeExpectancyForAge(ageDatum.coefficent, completeLifeTable);
}
//# sourceMappingURL=life-expectancy.js.map