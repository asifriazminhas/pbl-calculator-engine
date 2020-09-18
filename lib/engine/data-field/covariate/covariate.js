"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Covariate = void 0;

var _autobind2 = _interopRequireDefault(require("core-decorators/lib/autobind"));

var _tslib = require("tslib");

var _dataField = require("../data-field");

var _data = require("../../data/data");

var _errors = require("../../errors");

var _debugRisk = require("../../../debug/debug-risk");

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

var Covariate = /*#__PURE__*/function (_DataField) {
  _inherits(Covariate, _DataField);

  var _super = _createSuper(Covariate);

  function Covariate(covariateJson, customFunction, derivedField) {
    var _this;

    _classCallCheck(this, Covariate);

    _this = _super.call(this, covariateJson);
    _this.beta = covariateJson.beta;
    _this.groups = covariateJson.groups;
    _this.referencePoint = covariateJson.referencePoint;
    _this.customFunction = customFunction;
    _this.derivedField = derivedField;
    return _this;
  }

  _createClass(Covariate, [{
    key: "getComponent",
    value: function getComponent(data, userFunctions, tables) {
      var coefficient = this.calculateCoefficient(data, userFunctions, tables);
      var component = this.calculateComponent(coefficient);

      _debugRisk.debugRisk.addCovariateDebugInfo(this.name, {
        coefficient: coefficient,
        component: component,
        beta: this.beta
      });

      return component;
    }
  }, {
    key: "calculateCoefficient",
    value: function calculateCoefficient(data, userDefinedFunctions, tables) {
      var coefficent = 0;

      try {
        coefficent = (0, _data.findDatumWithName)(this.name, data).coefficent;
      } catch (err) {
        if (err instanceof _errors.NoDatumFoundError) {
          if (this.customFunction) {
            coefficent = this.customFunction.calculateCoefficient(data);
          } else if (this.derivedField) {
            coefficent = this.derivedField.calculateCoefficent(data, userDefinedFunctions, tables);
          }
        } else {
          throw err;
        }
      }

      var formattedCoefficent = this.formatCoefficentForComponent(coefficent);

      if (formattedCoefficent === undefined) {
        throw new Error("No coefficient found for covariate ".concat(this.name));
      }

      return formattedCoefficent;
    }
  }, {
    key: "calculateDataToCalculateCoefficent",
    value: function calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
      // Try to find a datum with the same name field in the data arg
      var datumFound = this.getDatumForField(data);
      /* If we did not find anything then we need to calculate the coefficent
      using either a custom function or the coresponding derived field */

      if (!datumFound) {
        if (this.customFunction) {
          return this.customFunction.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
        } else if (this.derivedField) {
          // Custom function has higher priority
          // Fall back to derived field
          try {
            return this.derivedField.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
          } catch (err) {
            return [];
          }
        } else {
          return [];
        }
      } else {
        // If the data for this covariate coefficient's calculations already exists in the data arg we don't need to return anything
        return [datumFound];
      }
    }
    /**
     * Returns all the fields which are part of this Covariate's dependency
     * tree. **Does not return the covariate itself**.
     *
     * @returns {DataField[]}
     * @memberof Covariate
     */

  }, {
    key: "getDescendantFields",
    value: function getDescendantFields() {
      return this.derivedField ? this.derivedField.getDescendantFields() : this.customFunction ? this.customFunction.firstVariableCovariate.getDescendantFields().concat(this.customFunction.firstVariableCovariate) : [];
    }
  }, {
    key: "isPartOfGroup",
    value: function isPartOfGroup(group) {
      return this.groups.indexOf(group) !== -1;
    }
  }, {
    key: "calculateComponent",
    value: function calculateComponent(coefficent) {
      var component = coefficent * this.beta;
      return component;
    }
  }, {
    key: "formatCoefficentForComponent",
    value: function formatCoefficentForComponent(coefficent) {
      if (coefficent === null || coefficent === undefined || coefficent === 'NA' || isNaN(coefficent)) {
        _debugRisk.debugRisk.addCovariateDebugInfo(this.name, {
          setToReference: true
        });

        return this.referencePoint;
      } else {
        return this.formatCoefficient(coefficent);
      }
    }
  }]);

  return Covariate;
}(_dataField.DataField);

exports.Covariate = Covariate;
exports.Covariate = Covariate = (0, _tslib.__decorate)([_autobind2.default, (0, _tslib.__metadata)("design:paramtypes", [Object, Object, Object])], Covariate);
//# sourceMappingURL=covariate.js.map