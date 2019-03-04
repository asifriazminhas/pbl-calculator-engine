"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var test_utils_1 = require("./test-utils");

var data_1 = require("../engine/data/data");

var chai_1 = require("chai");

var interaction_covariate_1 = require("../engine/data-field/covariate/interaction-covariate/interaction-covariate");

var errors_1 = require("../engine/errors");

function checkDataForAlgorithm(data, cox) {
  cox.covariates.filter(function (covariate) {
    return !(covariate instanceof interaction_covariate_1.InteractionCovariate);
  }).forEach(function (covariate) {
    data_1.findDatumWithName(covariate.name, data);
  });
}

function assertScore(expectedScore, actualScore, data) {
  var percentDiff = test_utils_1.getRelativeDifference(expectedScore, actualScore);
  var MaximumPercentDiff = 10;
  chai_1.expect(percentDiff).to.be.lessThan(10, "\n        Percent difference ".concat(percentDiff, " greater than ").concat(MaximumPercentDiff, "\n        Expected Score: ").concat(expectedScore, "\n        Actual Score: ").concat(actualScore, "\n        Data: ").concat(JSON.stringify(data), "\n    "));
}

function testCalculatedScoreForDataAndExpectedScore(coxAlgorithm, data) {
  // Debugging code

  /*if (expectedRisk !== 0.002523241) {
      return;
  }*/
  checkDataForAlgorithm(data, coxAlgorithm);
  var expectedRisk;

  try {
    expectedRisk = Number(data_1.findDatumWithName('RISK_5', data).coefficent);
  } catch (err) {
    if (!(err instanceof errors_1.NoDatumFoundError)) {
      throw err;
    }
  }

  var expectedSurvival;

  try {
    expectedSurvival = Number(data_1.findDatumWithName('s', data).coefficent);
  } catch (err) {
    if (!(err instanceof errors_1.NoDatumFoundError)) {
      throw err;
    }
  }

  var expectedBin;

  try {
    expectedBin = Number(data_1.findDatumWithName('Bin', data).coefficent);
  } catch (err) {
    if (!(err instanceof errors_1.NoDatumFoundError)) {
      throw err;
    }
  }

  if (coxAlgorithm.bins) {
    var binData = coxAlgorithm.bins.getBinDataForScore(Math.round(coxAlgorithm.calculateScore(data) * 10000000) / 10000000);
    var binNumber = Object.keys(coxAlgorithm.bins.binsData).map(Number).find(function (currentBinNumber) {
      return coxAlgorithm.bins.binsData[currentBinNumber] === binData;
    });
    chai_1.expect(binNumber, "\n            ran_id: ".concat(data_1.findDatumWithName('ran_id', data).coefficent, "\n        ")).to.equal(expectedBin);
  } else {
    if (expectedRisk !== undefined) {
      return assertScore(expectedRisk, coxAlgorithm.getRiskToTime(data), data);
    } else {
      return assertScore(expectedSurvival, coxAlgorithm.getSurvivalToTime(data), data);
    }
  }
}

test("Testing Scoring",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(t) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", test_utils_1.runIntegrationTest('score-data', 'score-data', 'Scoring', [], testCalculatedScoreForDataAndExpectedScore, t));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=score.spec.js.map