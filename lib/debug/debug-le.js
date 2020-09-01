"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugLe = void 0;

var _sum2 = _interopRequireDefault(require("lodash/sum"));

var _debugRisk = require("./debug-risk");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DebugLe = /*#__PURE__*/function () {
  function DebugLe() {
    _classCallCheck(this, DebugLe);

    this.sessionStarted = false;
    this.leCalculations = [];
  }

  _createClass(DebugLe, [{
    key: "startSession",
    value: function startSession() {
      this.sessionStarted = true;
      this.leCalculations = [];

      _debugRisk.debugRisk.startSession();
    }
  }, {
    key: "endSession",
    value: function endSession() {
      _debugRisk.debugRisk.endSession();

      this.sessionStarted = false;
    }
  }, {
    key: "startNewCalculation",
    value: function startNewCalculation(forIndividual) {
      if (this.sessionStarted === false) return;

      if (forIndividual === true) {
        this.leCalculations.push({
          completeLifeTable: [],
          lifeYearsRemaining: NaN,
          numQxCalcs: NaN
        });
      } else {
        this.leCalculations.push({
          sexInfo: [],
          populationLE: NaN
        });
      }
    }
  }, {
    key: "addEndDebugInfoForIndividual",
    value: function addEndDebugInfoForIndividual(completeLifeTable, numQxCalcs, lifeYearsRemaining) {
      if (this.sessionStarted === false) return;
      this.lastCalculation.completeLifeTable = completeLifeTable;
      this.lastCalculation.lifeYearsRemaining = lifeYearsRemaining;
      this.lastCalculation.numQxCalcs = numQxCalcs;
    }
  }, {
    key: "addEndDebugInfoPopulation",
    value: function addEndDebugInfoPopulation(populationLe) {
      if (this.sessionStarted === false) return;
      this.lastCalculation.populationLE = populationLe;
    }
  }, {
    key: "addSexDebugInfoForPopulation",
    value: function addSexDebugInfoForPopulation(sexDebugInfo) {
      if (this.sessionStarted === false) return;
      this.lastCalculation.sexInfo.push(sexDebugInfo);
    }
  }, {
    key: "printDebugInfo",
    value: function printDebugInfo() {
      var _this = this;

      this.leCalculations.forEach(function (leCalculation, index) {
        console.groupCollapsed("LE Calculation ".concat(index + 1));

        if ('lifeYearsRemaining' in leCalculation) {
          _this.printDebugInfoForIndividual(leCalculation);
        } else {
          _this.printDebugInfoForPopulation(leCalculation);
        }

        console.groupEnd();
      });
    }
  }, {
    key: "printDebugInfoForIndividual",
    value: function printDebugInfoForIndividual(debugInfo) {
      console.log("Abridged Individual Life Years Remaining");
      console.log("Life Years Remaining: ".concat(debugInfo.lifeYearsRemaining));
      console.log("Complete Life Table");
      console.table(debugInfo.completeLifeTable);
      console.groupCollapsed("Qx Calculations");
      var riskDebugStartIndex = this.getRiskDebugInfoStartIndex(debugInfo);
      debugInfo.completeLifeTable.forEach(function (_, index) {
        console.groupCollapsed("Life Table Row ".concat(index + 1));

        _debugRisk.debugRisk.printDebugInfo(riskDebugStartIndex + index);

        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      console.groupEnd();
    }
  }, {
    key: "printDebugInfoForPopulation",
    value: function printDebugInfoForPopulation(debugInfo) {
      console.log("Abridged life expectancy for population");
      console.log("Population life expectancy: ".concat(debugInfo.populationLE));
      var debugRiskStartIndex = this.getRiskDebugInfoStartIndex(debugInfo);
      debugInfo.sexInfo.forEach(function (_ref) {
        var sex = _ref.sex,
            qxs = _ref.qxs,
            completeLifeTable = _ref.completeLifeTable,
            le = _ref.le;
        console.groupCollapsed("Life table for sex: ".concat(sex));
        console.log("Life expectancy for sex ".concat(sex, ": ").concat(le));
        console.log("Complete life table");
        console.table(completeLifeTable);
        console.groupCollapsed("Individual qx calculations");
        qxs.forEach(function (qx, qxIndex) {
          console.groupCollapsed("Qx for sex ".concat(sex, " ").concat(qxIndex + 1));
          console.log("Qx: ".concat(qx));

          _debugRisk.debugRisk.printDebugInfo(debugRiskStartIndex + qxIndex);

          console.groupEnd();
        });
        console.groupEnd();
        console.groupEnd();
      });
    }
  }, {
    key: "getRiskDebugInfoStartIndex",
    value: function getRiskDebugInfoStartIndex(leDebugInfo) {
      return this.leCalculations.slice(0, this.leCalculations.indexOf(leDebugInfo)).reduce(function (startIndex, currentDebugInfo) {
        var numOfQxCalculations;

        if ('lifeYearsRemaining' in currentDebugInfo) {
          numOfQxCalculations = currentDebugInfo.numQxCalcs;
        } else {
          numOfQxCalculations = (0, _sum2.default)(currentDebugInfo.sexInfo.map(function (_ref2) {
            var qxs = _ref2.qxs;
            return qxs.length;
          }));
        }

        return startIndex + numOfQxCalculations;
      }, 0);
    }
  }, {
    key: "lastCalculation",
    get: function get() {
      return this.leCalculations[this.leCalculations.length - 1];
    }
  }]);

  return DebugLe;
}();

var debugLe = new DebugLe();
exports.debugLe = debugLe;
//# sourceMappingURL=debug-le.js.map