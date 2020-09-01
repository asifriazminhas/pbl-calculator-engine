"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var test = _interopRequireWildcard(require("tape"));

var _data = require("../engine/data/data");

var _derivedField = require("../engine/data-field/derived-field/derived-field");

var _chai = require("chai");

var _testUtils = require("./test-utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function formatTestingDataCsvColumn(column) {
  if (column === 'NA') {
    return undefined;
  } else if (isNaN(column)) {
    return column;
  } else {
    return Number(column);
  }
}

function getTestingDataForCovariate(covariate, allData) {
  if (covariate.derivedField) {
    var leafFields = (0, _derivedField.getLeafFieldsForDerivedField)(covariate.derivedField);
    var leadFieldNames = leafFields.map(function (leafField) {
      return leafField.name;
    });
    var inputData = allData.filter(function (datum) {
      return leadFieldNames.indexOf(datum.name) > -1;
    }).map(function (datum) {
      return Object.assign({}, datum, {
        coefficent: formatTestingDataCsvColumn(datum.coefficent)
      });
    });
    var expectedOutput = formatTestingDataCsvColumn((0, _data.findDatumWithName)(covariate.name, allData).coefficent);
    return {
      inputData: inputData,
      expectedOutput: expectedOutput
    };
  } else {
    return {
      inputData: [],
      expectedOutput: null
    };
  }
}

function testCovariateTransformations(covariate, inputData, expectedOutput, userFunctions, tables) {
  if (!covariate.derivedField) {
    return;
  } // tslint:disable-next-line


  _data.isEqual; // tslint:disable-next-line

  /*(const DataToDebug = [
      { name: 'age', coefficent: 20 },
      { name: 'lpa_lpa0', coefficent: 'Yes' },
      { name: 'lpa_lpa1', coefficent: 'Yes' },
      { name: 'lpam_lpa1', coefficent: 'lpa60' },
      { name: 'lpat_lpa1', coefficent: 5 },
      { name: 'lpa_lpa2', coefficent: 'Yes' },
      { name: 'lpam_lpa2', coefficent: 'lpa61' },
      { name: 'lpat_lpa2', coefficent: 70 },
      { name: 'lpa_lpa3', coefficent: 'Yes' },
      { name: 'lpam_lpa3', coefficent: 'lpa60' },
      { name: 'lpat_lpa3', coefficent: 20 },
      { name: 'lpa_lpa4', coefficent: 'Yes' },
      { name: 'lpam_lpa4', coefficent: 'lpa30' },
      { name: 'lpat_lpa4', coefficent: 70 },
      { name: 'lpa_lpa5', coefficent: 'Yes' },
      { name: 'lpam_lpa5', coefficent: 'lpa61' },
      { name: 'lpat_lpa5', coefficent: 2 },
      { name: 'lpa_lpa6', coefficent: 'Yes' },
      { name: 'lpam_lpa6', coefficent: 'lpa30' },
      { name: 'lpat_lpa6', coefficent: 20 },
      { name: 'lpa_lpa7', coefficent: 'Yes' },
      { name: 'lpam_lpa7', coefficent: 'lpa61' },
      { name: 'lpat_lpa7', coefficent: 70 },
      { name: 'lpa_lpa8', coefficent: 'Yes' },
      { name: 'lpam_lpa8', coefficent: 'lpa60' },
      { name: 'lpat_lpa8', coefficent: 5 },
      { name: 'lpa_lpa9', coefficent: 'Yes' },
      { name: 'lpam_lpa9', coefficent: 'lpa30' },
      { name: 'lpat_lpa9', coefficent: 5 },
      { name: 'lpa_lpa10', coefficent: 'Yes' },
      { name: 'lpam_lpa10', coefficent: 'lpa30' },
      { name: 'lpat_lpa10', coefficent: 15 },
      { name: 'lpa_lpa11', coefficent: 'Yes' },
      { name: 'lpam_lpa11', coefficent: 'lpa61' },
      { name: 'lpat_lpa11', coefficent: 5 },
      { name: 'lpa_lpa12', coefficent: 'Yes' },
      { name: 'lpam_lpa12', coefficent: 'lpa61' },
      { name: 'lpat_lpa12', coefficent: 4 },
      { name: 'lpa_lpa13', coefficent: 'Yes' },
      { name: 'lpam_lpa13', coefficent: 'lpa61' },
      { name: 'lpat_lpa13', coefficent: 4 },
      { name: 'lpa_lpa14', coefficent: 'Yes' },
      { name: 'lpam_lpa14', coefficent: 'lpa61' },
      { name: 'lpat_lpa14', coefficent: 1 },
      { name: 'lpa_lpa15', coefficent: 'Yes' },
      { name: 'lpam_lpa15', coefficent: 'lpa61' },
      { name: 'lpat_lpa15', coefficent: 1 },
      { name: 'lpa_lpa16', coefficent: 'Yes' },
      { name: 'lpam_lpa16', coefficent: 'lpa60' },
      { name: 'lpat_lpa16', coefficent: 10 },
      { name: 'lpa_lpa17', coefficent: 'Yes' },
      { name: 'lpam_lpa17', coefficent: 'lpa60' },
      { name: 'lpat_lpa17', coefficent: 2 },
      { name: 'lpa_lpa18', coefficent: 'Yes' },
      { name: 'lpam_lpa18', coefficent: 'lpa30' },
      { name: 'lpat_lpa18', coefficent: 2 },
      { name: 'lpa_lpa19', coefficent: 'Yes' },
      { name: 'lpam_lpa19', coefficent: 'lpa60' },
      { name: 'lpat_lpa19', coefficent: 6 },
      { name: 'lpa_lpa20', coefficent: 'Yes' },
      { name: 'lpam_lpa20', coefficent: 'lpa30' },
      { name: 'lpat_lpa20', coefficent: 3 },
      { name: 'lpa_lpa21', coefficent: 'No' },
      { name: 'lpam_lpa21' },
      { name: 'lpat_lpa21' },
      { name: 'lpa_lpa22', coefficent: 'Yes' },
      { name: 'lpam_lpa22', coefficent: 'lpa30' },
      { name: 'lpat_lpa22', coefficent: 2 },
  ];
  const CovariateToDebug = 'AgeCXPhysicalActivityC_int';
  if (
      !isDataOneEqualToDataTwo(DataToDebug, inputData) ||
      covariate.name !== CovariateToDebug
  ) {
      return;
  }*/

  var derivedField = covariate.derivedField;
  var actualOutput = derivedField.calculateCoefficent(inputData, userFunctions, tables);

  if (isNaN(actualOutput) && expectedOutput === undefined) {
    return;
  }

  if (actualOutput === 0 && expectedOutput === 0) {
    return;
  }

  var diffError = (expectedOutput - actualOutput) / expectedOutput; // tslint:disable-next-line

  (0, _chai.expect)(diffError < 0.00001 || diffError === 0, "Derived Field: ".concat(derivedField.name, "\n        Input Data: ").concat(JSON.stringify(inputData), "\n        Actual Output: ").concat(actualOutput, "\n        ExpectedOutput: ").concat(expectedOutput, "\n        DiffError: ").concat(diffError)).to.be.true;
}

test.skip("Testing local transformations", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _testUtils.runIntegrationTest)('local-transformations', 'local-transformations', 'Local Transformations', ['Sodium', 'SPoRT', 'RESPECT'], function (algorithm, data) {
              algorithm.covariates.forEach(function (covariate) {
                var _getTestingDataForCov = getTestingDataForCovariate(covariate, data),
                    inputData = _getTestingDataForCov.inputData,
                    expectedOutput = _getTestingDataForCov.expectedOutput;

                testCovariateTransformations(covariate, inputData, expectedOutput, algorithm.userFunctions, algorithm.tables);
              });
            }, t);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=local-transformations.spec.js.map