"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompleteLifeTableWithStartAge = getCompleteLifeTableWithStartAge;
exports.getCompleteLifeTableForDataUsingAlgorithm = getCompleteLifeTableForDataUsingAlgorithm;

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _data = require("../data");

var _moment = _interopRequireDefault(require("moment"));

var _data2 = require("../data/data");

var _nonInteractionCovariate = require("../data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var _dataField = require("../data-field/data-field");

var _interactionCovariate = require("../data-field/covariate/interaction-covariate/interaction-covariate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns lx for the passed life table row
 *
 * @param {(LifeTableRow | undefined)} lifeTableRow If undefined then it means
 * the function should return the lx for the first life table row which is by
 * default 100000
 * @returns {number}
 */
function getlxForLifeTableRow(lifeTableRow) {
  if (lifeTableRow === undefined) {
    return 100000;
  } else {
    return lifeTableRow.lx - lifeTableRow.dx;
  }
}
/**
 * Returns calculated value for dx from passed lx and qx arguments
 *
 * @param {number} lx
 * @param {number} qx
 * @returns {number}
 */


function getdx(lx, qx) {
  return lx * qx;
}
/**
 * Returns calculated value for Lx from passed lx, dx and ax arguments
 *
 * @param {number} lx
 * @param {number} dx
 * @param {number} ax
 * @returns
 */


function getLx(lx, dx, ax) {
  return lx - dx + dx * ax;
}
/**
 * Returns calculated value of Tx
 *
 * @param {LifeTableRow} lifeTableRow The row for which we need to calculate Tx
 * @param {(LifeTableRow | undefined)} nextLifeTableRow The next row after the lifeTableRow argument.
 * @returns {number}
 */


function getTx(lifeTableRow, nextLifeTableRow) {
  if (nextLifeTableRow === undefined) {
    return lifeTableRow.Lx;
  } else {
    return nextLifeTableRow.Tx + lifeTableRow.Lx;
  }
}
/**
 * Returns calculated value for ex
 *
 * @param {LifeTableRow} lifeTableRow The row for which we need to calculate ex
 * @param {(LifeTableRow | undefined)} nextLifeTableRow The next row after the lifeTableRow argument
 * @returns {number}
 */


function getex(lifeTableRow, nextLifeTableRow) {
  if (nextLifeTableRow === undefined) {
    return lifeTableRow.ax;
  } else {
    // Do this to avoid returning NaN
    if (lifeTableRow.lx === 0) {
      return 0;
    } else {
      return lifeTableRow.Tx / lifeTableRow.lx;
    }
  }
}
/**
 * Creates a new life table from the baseLifeTableWithQx which has only age, qx
 * and ax terms and completes it by adding lx, dx, Lx, Tx and ex terms
 *
 * @param {Array<BaseLifeTableWithQxRow>} baseLifeTableWithQx
 * @returns {Array<LifeTableRow>}
 */


function getCompleteLifeTableWithStartAge(refLifeTable, getPredictedRiskForAge, startAge) {
  var useLifeTableForExFromAge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 99;
  var lifeTable = [];
  var refLifeTableWithQx = [];
  var refLifeTableFromStartAge = refLifeTable.filter(function (refLifeTableRow) {
    return refLifeTableRow.age >= startAge;
  });
  refLifeTableFromStartAge.forEach(function (refLifeTableRow) {
    refLifeTableWithQx.push(Object.assign({}, refLifeTableRow, {
      qx: refLifeTableRow.age < useLifeTableForExFromAge ? getPredictedRiskForAge(refLifeTableRow.age) : refLifeTableRow.qx
    }));
  });
  refLifeTableWithQx.forEach(function (baseLifeTableRow, index) {
    var lx = getlxForLifeTableRow(lifeTable[index - 1]);
    var dx = getdx(lx, baseLifeTableRow.qx);
    var Lx = getLx(lx, dx, baseLifeTableRow.ax);
    lifeTable.push(Object.assign({}, baseLifeTableRow, {
      lx: lx,
      dx: dx,
      Lx: Lx,
      Tx: 0,
      ex: 0
    }));
  });
  var reversedLifeTable = refLifeTable.reverse();
  /* Reverse the lifetable since for Tx and ex we need the current row and next row */

  lifeTable.reverse().forEach(function (lifeTableRow, index) {
    lifeTableRow.Tx = getTx(lifeTableRow, lifeTable[index - 1]);
    lifeTableRow.ex = Number(lifeTableRow.age) < useLifeTableForExFromAge ? getex(lifeTableRow, lifeTable[index - 1]) : reversedLifeTable[index].ex;
  });
  refLifeTable.reverse(); // Reverse the life table again since reverse is a mutable operation

  lifeTable.reverse();
  return lifeTable;
}

function getCompleteLifeTableForDataUsingAlgorithm(refLifeTable, data, cox) {
  var useExFromLifeTableFromAge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 99;
  var getPredictedRiskForAge = arguments.length > 4 ? arguments[4] : undefined;
  var ageInteractionCovariates = cox.covariates.filter(function (covariate) {
    return covariate instanceof _interactionCovariate.InteractionCovariate && covariate.isPartOfGroup('AGE');
  });
  var ageNonInteractionCovariates = cox.covariates.filter(function (covariate) {
    return covariate instanceof _nonInteractionCovariate.NonInteractionCovariate && covariate.isPartOfGroup('AGE');
  });

  var allAgeFields = _dataField.DataField.getUniqueDataFields((0, _flatten2.default)(ageNonInteractionCovariates.map(function (covariate) {
    return covariate.getDescendantFields();
  }).concat(ageInteractionCovariates).concat(ageNonInteractionCovariates)));

  var dataWithoutAgeFields = (0, _data2.filterDataForFields)(data, allAgeFields);
  var ageDatum = (0, _data.findDatumWithName)('age', data);
  /* When we go through each row of the life table and calculate ex, the only
  coefficient that changes going from one covariate to the next are the ones
  belonging to the age covariate since we increment the age value from one
  row of the life table to the next. As an optimization we precalculate the
  coefficients for all covariates that are not part of the age group and add
  them to the data which will be used to calculate the life table */

  var lifeTableDataWithoutAge = (0, _data2.filterDataForFields)(cox.getCovariatesWithoutGroup('AGE')
  /* Goes through all non-age covariates and calculates the data
  required to calculate the coefficient for each one. Then uses the
  data to calculate the actual coefficient and finally adds it all
  to the currentData argument to be used by the next covariate */
  .reduce(function (currentData, covariate) {
    var currentCoefficientData = covariate.calculateDataToCalculateCoefficent(currentData, cox.userFunctions, cox.tables);
    var covariateCoefficient = {
      name: covariate.name,
      coefficent: covariate.calculateCoefficient(currentCoefficientData, cox.userFunctions, cox.tables)
    };
    return currentData.concat(currentCoefficientData).concat([covariateCoefficient]);
  }, dataWithoutAgeFields.concat(ageDatum)), allAgeFields);
  return getCompleteLifeTableWithStartAge(refLifeTable, function (age) {
    if (getPredictedRiskForAge) {
      return getPredictedRiskForAge(age);
    } else {
      var now = (0, _moment.default)();
      now.add(1, 'year');
      return cox.getRiskToTime(lifeTableDataWithoutAge.concat({
        name: 'age',
        coefficent: age
      }), now);
    }
  }, ageDatum.coefficent, useExFromLifeTableFromAge);
}
//# sourceMappingURL=life-table.js.map