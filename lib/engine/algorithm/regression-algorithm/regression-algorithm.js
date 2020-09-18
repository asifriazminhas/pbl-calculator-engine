"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegressionAlgorithm = void 0;

var _add2 = _interopRequireDefault(require("lodash/add"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _memoize2 = _interopRequireDefault(require("lodash/memoize"));

var _algorithm = require("../algorithm");

var _covariate = require("../../data-field/covariate/covariate");

var _jsonCovariate = require("../../../parsers/json/json-covariate");

var _dataField = require("../../data-field/data-field");

var _datum = require("../../data/datum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RegressionAlgorithm = /*#__PURE__*/function (_Algorithm) {
  _inherits(RegressionAlgorithm, _Algorithm);

  var _super = _createSuper(RegressionAlgorithm);

  function RegressionAlgorithm(regressionAlgorithmJson) {
    var _this;

    _classCallCheck(this, RegressionAlgorithm);

    _this = _super.call(this, regressionAlgorithmJson);
    _this.getAllFields = (0, _memoize2.default)(function () {
      return _dataField.DataField.getUniqueDataFields((0, _flatten2.default)(_this.covariates.map(function (currentCovariate) {
        return currentCovariate.getDescendantFields().concat(currentCovariate);
      })));
    });
    _this.covariates = regressionAlgorithmJson.covariates.map(function (covariateJson) {
      return (0, _jsonCovariate.parseCovariateJsonToCovariate)(covariateJson, regressionAlgorithmJson.covariates, regressionAlgorithmJson.derivedFields);
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name);
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
      }).reduce(_add2.default, 0);
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
      return _dataField.DataField.getUniqueDataFields((0, _flatten2.default)(covariatesForGroup.map(function (currentCovariate) {
        return currentCovariate.getDescendantFields();
      }))).concat(covariatesForGroup);
    }
  }, {
    key: "replaceCovariate",
    value: function replaceCovariate(externalCovariate) {
      var currentCovariate = this.covariates.find(function (covariate) {
        return covariate.name === externalCovariate.name;
      });

      if (!currentCovariate) {
        console.warn("No covariate with name ".concat(externalCovariate.name, " found to replace"));
        return this;
      }

      var newCovariate = Object.setPrototypeOf(Object.assign({}, currentCovariate, {
        name: externalCovariate.name,
        beta: externalCovariate.beta
      }), _covariate.Covariate.prototype);
      return Object.setPrototypeOf(Object.assign({}, this, {
        covariates: this.covariates.filter(function (covariate) {
          return covariate.name !== externalCovariate.name;
        }).concat(newCovariate)
      }), Object.getPrototypeOf(this));
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
        var dataFieldForCurrentDatum = _dataField.DataField.findDataFieldWithName(allDataFields, datum.name);

        return dataFieldForCurrentDatum ? (0, _datum.datumFactoryFromDataField)(dataFieldForCurrentDatum, datum.coefficent) : datum;
      });
    }
  }]);

  return RegressionAlgorithm;
}(_algorithm.Algorithm);

exports.RegressionAlgorithm = RegressionAlgorithm;
//# sourceMappingURL=regression-algorithm.js.map