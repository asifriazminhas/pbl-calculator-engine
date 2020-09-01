"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var test = _interopRequireWildcard(require("tape"));

var _testUtils = require("./test-utils");

var _data = require("../engine/data/data");

var _chai = require("chai");

var _interactionCovariate = require("../engine/data-field/covariate/interaction-covariate/interaction-covariate");

var _errors = require("../engine/errors");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function checkDataForAlgorithm(data, cox) {
  cox.covariates.filter(function (covariate) {
    return !(covariate instanceof _interactionCovariate.InteractionCovariate);
  }).forEach(function (covariate) {
    (0, _data.findDatumWithName)(covariate.name, data);
  });
}

function assertScore(expectedScore, actualScore, data) {
  var percentDiff = (0, _testUtils.getRelativeDifference)(expectedScore, actualScore);
  var MaximumPercentDiff = 10;
  (0, _chai.expect)(percentDiff).to.be.lessThan(10, "\n        Percent difference ".concat(percentDiff, " greater than ").concat(MaximumPercentDiff, "\n        Expected Score: ").concat(expectedScore, "\n        Actual Score: ").concat(actualScore, "\n        Data: ").concat(JSON.stringify(data), "\n    "));
}

function testCalculatedScoreForDataAndExpectedScore(coxAlgorithm, data) {
  // Debugging code

  /*if (expectedRisk !== 0.002523241) {
      return;
  }*/
  checkDataForAlgorithm(data, coxAlgorithm);
  var expectedRisk;

  try {
    expectedRisk = Number((0, _data.findDatumWithName)('RISK_5', data).coefficent);
  } catch (err) {
    if (!(err instanceof _errors.NoDatumFoundError)) {
      throw err;
    }
  }

  var expectedSurvival;

  try {
    expectedSurvival = Number((0, _data.findDatumWithName)('s', data).coefficent);
  } catch (err) {
    if (!(err instanceof _errors.NoDatumFoundError)) {
      throw err;
    }
  }

  var expectedBin;

  try {
    expectedBin = Number((0, _data.findDatumWithName)('Bin', data).coefficent);
  } catch (err) {
    if (!(err instanceof _errors.NoDatumFoundError)) {
      throw err;
    }
  }

  if (coxAlgorithm.bins) {
    var binData = coxAlgorithm.bins.getBinDataForScore(Math.round(coxAlgorithm.calculateScore(data) * 10000000) / 10000000);
    var binNumber = Object.keys(coxAlgorithm.bins.binsData).map(Number).find(function (currentBinNumber) {
      return coxAlgorithm.bins.binsData[currentBinNumber] === binData;
    });
    (0, _chai.expect)(binNumber, "\n            ran_id: ".concat((0, _data.findDatumWithName)('ran_id', data).coefficent, "\n        ")).to.equal(expectedBin);
  } else {
    if (expectedRisk !== undefined) {
      return assertScore(expectedRisk, coxAlgorithm.getRiskToTime(data), data);
    } else {
      return assertScore(expectedSurvival, coxAlgorithm.getSurvivalToTime(data), data);
    }
  }
}

test.skip("Testing Scoring", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _testUtils.runIntegrationTest)('score-data', 'score-data', 'Scoring', [], testCalculatedScoreForDataAndExpectedScore, t));

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
//# sourceMappingURL=score.spec.js.map