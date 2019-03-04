"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = require("tslib");

var data_1 = require("../../../data");

var core_decorators_1 = require("core-decorators");

var datum_1 = require("../../../data/datum");

var RcsCustomFunction =
/*#__PURE__*/
function () {
  function RcsCustomFunction(rcsCustomFunctionJson, firstVariableCovariate) {
    _classCallCheck(this, RcsCustomFunction);

    this.knots = rcsCustomFunctionJson.knots;
    this.variableNumber = rcsCustomFunctionJson.variableNumber;
    this.firstVariableCovariate = firstVariableCovariate;
  }

  _createClass(RcsCustomFunction, [{
    key: "calculateCoefficient",
    value: function calculateCoefficient(data) {
      var datumValue = data_1.findDatumWithName(this.firstVariableCovariate.name, data).coefficent;
      var coefficent = this.getFirstTerm(datumValue) - this.getSecondTerm(datumValue) + this.getThirdTerm(datumValue);
      return coefficent;
    }
  }, {
    key: "calculateDataToCalculateCoefficent",
    value: function calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
      return [datum_1.datumFactoryFromDataField(this.firstVariableCovariate, this.firstVariableCovariate.calculateCoefficient(data, userDefinedFunctions, tables))];
    } // Calculates the first term in the spline equation

  }, {
    key: "getFirstTerm",
    value: function getFirstTerm(firstVariableValue) {
      var numerator = firstVariableValue - this.knots[this.variableNumber - 2];
      var denominator = Math.pow(this.knots[this.knots.length - 1] - this.knots[0], 2 / 3);
      return Math.pow(Math.max(numerator / denominator, 0), 3);
    } //Calculates the second term in the spline equation

  }, {
    key: "getSecondTerm",
    value: function getSecondTerm(firstVariableValue) {
      var coefficentNumerator = this.knots[this.knots.length - 1] - this.knots[this.variableNumber - 2];
      var coefficentDenominator = this.knots[this.knots.length - 1] - this.knots[this.knots.length - 2];
      var coefficent = coefficentNumerator / coefficentDenominator;
      var numerator = firstVariableValue - this.knots[this.knots.length - 2];
      var denominator = Math.pow(this.knots[this.knots.length - 1] - this.knots[0], 2 / 3);
      return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
    } //Calculates the third term inthe spline equation

  }, {
    key: "getThirdTerm",
    value: function getThirdTerm(firstVariableValue) {
      var coefficentNumerator = this.knots[this.knots.length - 2] - this.knots[this.variableNumber - 2];
      var coefficentDenominator = this.knots[this.knots.length - 1] - this.knots[this.knots.length - 2];
      var coefficent = coefficentNumerator / coefficentDenominator;
      var numerator = firstVariableValue - this.knots[this.knots.length - 1];
      var denominator = Math.pow(this.knots[this.knots.length - 1] - this.knots[0], 2 / 3);
      return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
    }
  }]);

  return RcsCustomFunction;
}();

RcsCustomFunction = tslib_1.__decorate([core_decorators_1.autobind], RcsCustomFunction);
exports.RcsCustomFunction = RcsCustomFunction;
//# sourceMappingURL=rcs-custom-function.js.map