"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var test = _interopRequireWildcard(require("tape"));

var _testUtils = require("./test-utils");

var _data = require("../engine/data");

var _chai = require("chai");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
    var expectedCoefficient = (0, _data.findDatumWithName)(currentNotFirstVaribleRcsCovariate.name, data).coefficent;
    (0, _chai.expect)((0, _testUtils.getRelativeDifference)(expectedCoefficient, actualCoefficient), "\n                Name: ".concat(currentNotFirstVaribleRcsCovariate.name, "\n                Expected: ").concat(expectedCoefficient, "\n                Actual: ").concat(actualCoefficient, "\n                index: ").concat(index, "\n            ")).to.be.lessThan(10);
  });
}

test.skip("RCS Function", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _testUtils.runIntegrationTest)('score-data', 'score-data', 'RCS Function', ['RESPECT', 'MPoRT', 'SPoRT', 'MPoRTv2'], testRcsForAlgorithm, t);

          case 2:
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
//# sourceMappingURL=rcs.spec.js.map