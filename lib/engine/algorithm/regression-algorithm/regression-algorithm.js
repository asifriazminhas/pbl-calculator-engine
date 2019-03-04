"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var algorithm_1 = require("../algorithm");

var lodash_1 = require("lodash");

var json_covariate_1 = require("../../../parsers/json/json-covariate");

var data_field_1 = require("../../data-field/data-field");

var datum_1 = require("../../data/datum");

var RegressionAlgorithm =
/*#__PURE__*/
function (_algorithm_1$Algorith) {
  _inherits(RegressionAlgorithm, _algorithm_1$Algorith);

  function RegressionAlgorithm(regressionAlgorithmJson) {
    var _this;

    _classCallCheck(this, RegressionAlgorithm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RegressionAlgorithm).call(this, regressionAlgorithmJson));
    _this.getAllFields = lodash_1.memoize(function () {
      return data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(_this.covariates.map(function (currentCovariate) {
        return currentCovariate.getDescendantFields();
      })));
    });
    _this.covariates = regressionAlgorithmJson.covariates.map(function (covariateJson) {
      return json_covariate_1.parseCovariateJsonToCovariate(covariateJson, regressionAlgorithmJson.covariates, regressionAlgorithmJson.derivedFields);
    });
    return _this;
  }

  _createClass(RegressionAlgorithm, [{
    key: "calculateScore",
    value: function calculateScore(data) {
      var _this2 = this;

      /* Go through all the covariates and calculate the data needed to
      calculate the coefficient for each one. On each loop we add the data
      returned to the currentData variable so that we don't recalculate data
      */
      var componentCalculationData = this.covariates.reduce(function (currentData, covariate) {
        var dataForCurrentCovariate = covariate.calculateDataToCalculateCoefficent(currentData, _this2.userFunctions, _this2.tables);
        return currentData.concat(dataForCurrentCovariate);
      }, this.validateData(data));
      return this.covariates.map(function (covariate) {
        return covariate.getComponent(componentCalculationData, _this2.userFunctions, _this2.tables);
      }).reduce(lodash_1.add, 0);
    }
  }, {
    key: "getCovariatesForGroup",
    value: function getCovariatesForGroup(group) {
      return this.covariates.filter(function (covariate) {
        return covariate.isPartOfGroup(group);
      });
    }
  }, {
    key: "getCovariatesWithoutGroup",
    value: function getCovariatesWithoutGroup(group) {
      return this.covariates.filter(function (covariate) {
        return covariate.isPartOfGroup(group) === false;
      });
    }
  }, {
    key: "getAllFieldsForGroup",
    value: function getAllFieldsForGroup(group) {
      var covariatesForGroup = this.getCovariatesForGroup(group);
      return data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(covariatesForGroup.map(function (currentCovariate) {
        return currentCovariate.getDescendantFields();
      }))).concat(covariatesForGroup);
    }
    /**
     * Goes through each datum in the data arg and does the following checks:
     * 1. Checks whether they are within the bounds defined by the interval
     * field on the corresponding DataField object. If they aren't, sets them
     * to either the lower or upper bound
     *
     * @private
     * @param {Data} data
     * @returns {Data}
     * @memberof RegressionAlgorithm
     */

  }, {
    key: "validateData",
    value: function validateData(data) {
      var allDataFields = this.getAllFields();
      return data.map(function (datum) {
        var dataFieldForCurrentDatum = data_field_1.DataField.findDataFieldWithName(allDataFields, datum.name);
        return dataFieldForCurrentDatum ? datum_1.datumFactoryFromDataField(dataFieldForCurrentDatum, datum.coefficent) : datum;
      });
    }
  }]);

  return RegressionAlgorithm;
}(algorithm_1.Algorithm);

exports.RegressionAlgorithm = RegressionAlgorithm;
//# sourceMappingURL=regression-algorithm.js.map