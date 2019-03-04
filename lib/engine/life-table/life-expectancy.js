"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var life_table_1 = require("./life-table");

var data_1 = require("../data");
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

exports.getLifeExpectancyForAge = getLifeExpectancyForAge;

function getLifeExpectancyUsingRefLifeTable(data, refLifeTable, coxAlgorithm) {
  var useExFromLifeTableFromAge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 99;
  var completeLifeTable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : life_table_1.getCompleteLifeTableForDataUsingAlgorithm(refLifeTable, data, coxAlgorithm, useExFromLifeTableFromAge);
  // TODO Change this to have an optional parameter called age
  var ageDatum = data_1.findDatumWithName('age', data);
  return getLifeExpectancyForAge(ageDatum.coefficent, completeLifeTable);
}

exports.getLifeExpectancyUsingRefLifeTable = getLifeExpectancyUsingRefLifeTable;
//# sourceMappingURL=life-expectancy.js.map