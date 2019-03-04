"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var test_utils_1 = require("./test-utils");

var data_1 = require("../engine/data");

var chai_1 = require("chai");

function testRcsForAlgorithm(algorithm, data, index) {
  var notFirstVariableRcsCovariate = algorithm.covariates.filter(function (currentCovariate) {
    return currentCovariate.customFunction !== undefined;
  });
  var dataWithoutSecondVariableCovariates = data.filter(function (datum) {
    return notFirstVariableRcsCovariate.find(function (covariate) {
      return covariate.name === datum.name;
    }) ? false : true;
  });
  notFirstVariableRcsCovariate.forEach(function (currentNotFirstVaribleRcsCovariate) {
    var actualCoefficient = currentNotFirstVaribleRcsCovariate.calculateCoefficient(dataWithoutSecondVariableCovariates, algorithm.userFunctions, algorithm.tables);
    var expectedCoefficient = data_1.findDatumWithName(currentNotFirstVaribleRcsCovariate.name, data).coefficent;
    chai_1.expect(test_utils_1.getRelativeDifference(expectedCoefficient, actualCoefficient), "\n                Name: ".concat(currentNotFirstVaribleRcsCovariate.name, "\n                Expected: ").concat(expectedCoefficient, "\n                Actual: ").concat(actualCoefficient, "\n                index: ").concat(index, "\n            ")).to.be.lessThan(10);
  });
}

test("RCS Function",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(t) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return test_utils_1.runIntegrationTest('score-data', 'score-data', 'RCS Function', ['RESPECT', 'MPoRT', 'SPoRT', 'MPoRTv2'], testRcsForAlgorithm, t);

          case 2:
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
//# sourceMappingURL=rcs.spec.js.map