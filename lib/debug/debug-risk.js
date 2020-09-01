"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugRisk = void 0;

var _covariateDepGraph = require("../covariate-dep-graph");

var _covariate = require("../engine/data-field/covariate/covariate");

var _derivedField = require("../engine/data-field/derived-field/derived-field");

var _data = require("../engine/data");

var _errors = require("../engine/errors");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DebugRisk = /*#__PURE__*/function () {
  function DebugRisk() {
    _classCallCheck(this, DebugRisk);

    this.sessionStarted = false;
    this.calculationStarted = false;
    this.debugInfo = [];
  }

  _createClass(DebugRisk, [{
    key: "startSession",
    value: function startSession() {
      this.debugInfo = [];
      this.sessionStarted = true;
    }
  }, {
    key: "endSession",
    value: function endSession() {
      this.sessionStarted = false;
      this.calculationStarted = false;
    }
  }, {
    key: "startNewCalculation",
    value: function startNewCalculation() {
      if (this.sessionStarted === false) return;
      this.calculationStarted = true;
      this.debugInfo.push({
        calculatedValues: {},
        covariates: [],
        riskData: [],
        score: NaN,
        risk: NaN
      });
    }
  }, {
    key: "addFieldDebugInfo",
    value: function addFieldDebugInfo(fieldName, coefficient) {
      if (this.shouldRunDebugMethod() === false) return;
      this.currentCalculation.calculatedValues[fieldName] = {
        coefficient: coefficient
      };
    }
  }, {
    key: "addCovariateDebugInfo",
    value: function addCovariateDebugInfo(covariateName, debugInfo) {
      if (this.shouldRunDebugMethod() === false) return;
      this.currentCalculation.calculatedValues[covariateName] = Object.assign({}, this.currentCalculation.calculatedValues[covariateName], debugInfo);
    }
  }, {
    key: "addEndDebugInfo",
    value: function addEndDebugInfo(covariates, riskData, score, risk) {
      if (this.shouldRunDebugMethod() === false) return;
      this.currentCalculation.covariates = covariates;
      this.currentCalculation.riskData = riskData;
      this.currentCalculation.score = score;
      this.currentCalculation.risk = risk;
      this.calculationStarted = false;
    }
  }, {
    key: "printDebugInfo",
    value: function printDebugInfo(printIndex) {
      var _this = this;

      var debugInfoToPrint = printIndex === undefined ? this.debugInfo : this.debugInfo.filter(function (_, index) {
        return index === printIndex;
      });
      debugInfoToPrint.forEach(function (currentDebugInfo, index) {
        var covariates = currentDebugInfo.covariates,
            riskData = currentDebugInfo.riskData,
            risk = currentDebugInfo.risk,
            score = currentDebugInfo.score;
        var covariateDepTrees = covariates.map(function (covariate) {
          return new _covariateDepGraph.CovariateDepGraph(covariate);
        });

        if (printIndex === undefined) {
          console.groupCollapsed("Risk Calculation ".concat(index + 1));
        }

        console.log("5 Year Risk: ".concat(risk));
        console.log("Score: ".concat(score));
        covariateDepTrees.forEach(function (covariateDepTree) {
          _this.printFieldDebugInfo(currentDebugInfo, covariateDepTree, covariateDepTree.covariateUuid, riskData);
        });

        if (printIndex === undefined) {
          console.groupEnd();
        }
      });
    } // Helper Public Methods

  }, {
    key: "getCovariateDebugInfo",
    value: function getCovariateDebugInfo(calcIndex, covariateName) {
      return this.debugInfo[calcIndex].calculatedValues[covariateName];
    }
  }, {
    key: "printFieldDebugInfo",
    value: function printFieldDebugInfo(riskDebugInfo, depGraph, fieldNodeUuid, riskData) {
      var _this2 = this;

      var node = depGraph.getNodeData(fieldNodeUuid);
      var field = node.field;
      console.groupCollapsed(field.name);

      if (field instanceof _covariate.Covariate) {
        this.printCovariateDebugInfo(riskDebugInfo, field, riskData);
      } else if (field instanceof _derivedField.DerivedField) {
        this.printDerivedFieldDebugInfo(riskDebugInfo, field, riskData);
      } else {
        // Otherwise this is a DataField and is a leaf field i.e on without
        // any dependencies and should come from the raw data
        var leafFieldCoefficient = this.getCoefficientForField(riskDebugInfo, field, riskData);
        console.log("Coefficient: ".concat(leafFieldCoefficient));
      } // @ts-ignore
      // outgoingEdges is private and so we need to add the ts-ignore
      // We use outgoingEdges instead of the dependenciesOf method since it
      // returns all descendants and not just the children of the node


      depGraph.outgoingEdges[fieldNodeUuid].forEach(function (childFieldNodeUuid) {
        _this2.printFieldDebugInfo(riskDebugInfo, depGraph, childFieldNodeUuid, riskData);
      });
      console.groupEnd();
    }
  }, {
    key: "printCovariateDebugInfo",
    value: function printCovariateDebugInfo(riskDebugInfo, covariate, riskData) {
      var valueForField = riskDebugInfo.calculatedValues[covariate.name];
      console.log("Beta Coefficient: ".concat(valueForField.beta));
      console.log("Component: ".concat(valueForField.component));

      if (covariate.derivedField) {
        this.printDerivedFieldDebugInfo(riskDebugInfo, covariate.derivedField, riskData);
      } else {
        console.log("Coefficient: ".concat(valueForField.coefficient));
      }
    }
  }, {
    key: "printDerivedFieldDebugInfo",
    value: function printDerivedFieldDebugInfo(riskDebugInfo, derivedField, riskData) {
      var _this3 = this;

      var valueForField = riskDebugInfo.calculatedValues[derivedField.name];

      if (valueForField === undefined) {
        console.warn("Coefficient could not be calculated");
      } else {
        console.log("Coefficient: ".concat(valueForField.coefficient));
      }

      console.log("Equation: ".concat(derivedField.equation));
      var derivedFromData = derivedField.derivedFrom.map(function (derivedFromField) {
        return {
          Name: derivedFromField.name,
          Coefficient: _this3.getCoefficientForField(riskDebugInfo, derivedFromField, riskData)
        };
      });
      console.log("Equation Data:");
      console.table(derivedFromData);
    }
  }, {
    key: "getCoefficientForField",
    value: function getCoefficientForField(riskDebugInfo, field, riskData) {
      var valueForField = riskDebugInfo.calculatedValues[field.name];

      if (valueForField === undefined) {
        try {
          return (0, _data.findDatumWithName)(field.name, riskData).coefficent;
        } catch (err) {
          if (err instanceof _errors.NoDatumFoundError) {
            console.log("No coefficient found");
          } else {
            throw err;
          }
        }
      } else {
        return valueForField.coefficient;
      }
    }
  }, {
    key: "shouldRunDebugMethod",
    value: function shouldRunDebugMethod() {
      return this.sessionStarted && this.calculationStarted;
    }
  }, {
    key: "currentCalculation",
    get: function get() {
      return this.debugInfo[this.debugInfo.length - 1];
    }
  }]);

  return DebugRisk;
}();

var debugRisk = new DebugRisk();
exports.debugRisk = debugRisk;
//# sourceMappingURL=debug-risk.js.map