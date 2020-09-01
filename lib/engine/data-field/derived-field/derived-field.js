"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLeafFieldsForDerivedField = getLeafFieldsForDerivedField;
exports.DerivedField = void 0;

var _autobind2 = _interopRequireDefault(require("core-decorators/lib/autobind"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _tslib = require("tslib");

var _dataField = require("../data-field");

var _covariate = require("../covariate/covariate");

var _undefined = require("../../../util/undefined");

var _errors = require("../../errors");

var _pmmlFunctions = _interopRequireDefault(require("./pmml-functions"));

var _datum = require("../../data/datum");

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

var DerivedField_1;

// tslint:disable-next-line:only-arrow-functions
var getValueFromTable = function getValueFromTable(table, outputColumn, conditions) {
  var conditionTableColumns = Object.keys(conditions);
  return (0, _undefined.throwErrorIfUndefined)(table.find(function (row) {
    var unMatchedColumn = conditionTableColumns.find(function (conditionColumn) {
      // tslint:disable-next-line
      return row[conditionColumn] != conditions[conditionColumn];
    });
    return unMatchedColumn === undefined ? true : false;
  }), new _errors.NoTableRowFoundError(conditions))[outputColumn];
};

function getLeafFieldsForDerivedField(derivedField) {
  if (derivedField.derivedFrom.length === 0) {
    return [derivedField];
  } else {
    return (0, _flatten2.default)(derivedField.derivedFrom.map(function (derivedFromItem) {
      if (derivedFromItem instanceof DerivedField) {
        return getLeafFieldsForDerivedField(derivedFromItem);
      } else if (derivedFromItem instanceof _covariate.Covariate) {
        if (derivedFromItem.derivedField) {
          return getLeafFieldsForDerivedField(derivedFromItem.derivedField);
        } else {
          return derivedFromItem;
        }
      } else {
        return derivedFromItem;
      }
    }));
  }
}

var DerivedField = DerivedField_1 = /*#__PURE__*/function (_DataField) {
  _inherits(DerivedField, _DataField);

  var _super = _createSuper(DerivedField);

  function DerivedField(derivedFieldJson, derivedFrom) {
    var _this;

    _classCallCheck(this, DerivedField);

    _this = _super.call(this, derivedFieldJson);
    _this.name = derivedFieldJson.name;
    _this.equation = derivedFieldJson.equation;
    _this.derivedFrom = derivedFrom;
    return _this;
  }

  _createClass(DerivedField, [{
    key: "evaluateEquation",
    value: function evaluateEquation(obj, userFunctions, tables) {
      // tslint:disable-next-line
      obj; // tslint:disable-next-line

      userFunctions; // tslint:disable-next-line

      tables; // tslint:disable-next-line

      var derived = undefined; // tslint:disable-next-line

      var func = _pmmlFunctions.default; // tslint:disable-next-line

      func;
      func['getValueFromTable'] = getValueFromTable;
      eval(this.equation);
      return derived;
    }
  }, {
    key: "calculateCoefficent",
    value: function calculateCoefficent(data, userDefinedFunctions, tables) {
      var _this2 = this;

      /*Check if there is a datum for this intermediate predictor. If there is then we don't need to go further*/
      var datumForCurrentDerivedField = this.getDatumForField(data);

      if (datumForCurrentDerivedField) {
        return datumForCurrentDerivedField.coefficent;
      } else {
        /*Filter out all the datum which are not needed for the equation evaluation*/
        var dataForEvaluation = data.filter(function (datum) {
          return _this2.derivedFrom.find(function (derivedFromItem) {
            return derivedFromItem.name === datum.name;
          }) ? true : false;
        });
        /*If we don't have all the data for evaluation when calculate it*/

        if (dataForEvaluation.length !== this.derivedFrom.length) {
          dataForEvaluation = this.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
        }
        /*make the object with the all the data needed for the equation evaluation*/


        var obj = {};
        dataForEvaluation.forEach(function (datum) {
          obj[datum.name] = datum.coefficent;
        });
        var evaluatedValue = this.evaluateEquation(obj, userDefinedFunctions, tables);
        var returnedCalculatedValue; // null or an empty string are coerced to 0 when passed through the Number function in the next statement. This statement will reset them to undefined so that any further manipulations in upstream fields will always return undefined.

        if (evaluatedValue === null || typeof evaluatedValue === 'string' && evaluatedValue.trim().length === 0) {
          returnedCalculatedValue = undefined;
        } // To handle cases where the value is '1', '2' etc.
        else if (isNaN(Number(evaluatedValue)) === false) {
            returnedCalculatedValue = Number(evaluatedValue);
          } else if (typeof evaluatedValue === 'string') {
            returnedCalculatedValue = evaluatedValue;
          } else {
            returnedCalculatedValue = this.formatCoefficient(evaluatedValue);
          }

        _debugRisk.debugRisk.addFieldDebugInfo(this.name, returnedCalculatedValue);

        return returnedCalculatedValue;
      }
    }
  }, {
    key: "calculateDataToCalculateCoefficent",
    value: function calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
      /*Go through each explanatory predictor and calculate the coefficent for
      each which will be used for the evaluation*/
      return (0, _flatten2.default)(this.derivedFrom.map(function (derivedFromItem) {
        var datumFound = derivedFromItem.getDatumForField(data);

        if (datumFound) {
          return [datumFound];
        }

        if (derivedFromItem instanceof _covariate.Covariate) {
          return (0, _datum.datumFactoryFromDataField)(derivedFromItem, derivedFromItem.calculateCoefficient(data, userDefinedFunctions, tables));
        } else if (derivedFromItem instanceof DerivedField_1) {
          return (0, _datum.datumFactoryFromDataField)(derivedFromItem, derivedFromItem.calculateCoefficent(data, userDefinedFunctions, tables));
        } else {
          return {
            name: derivedFromItem.name,
            coefficent: undefined
          };
        }
      }));
    }
  }, {
    key: "getDescendantFields",
    value: function getDescendantFields() {
      return _dataField.DataField.getUniqueDataFields((0, _flatten2.default)(this.derivedFrom.map(function (derivedFromItem) {
        if (derivedFromItem instanceof _covariate.Covariate) {
          if (derivedFromItem.derivedField) {
            return derivedFromItem.derivedField.getDescendantFields().concat(derivedFromItem);
          } else {
            return derivedFromItem;
          }
        } else if (derivedFromItem instanceof DerivedField_1) {
          return derivedFromItem.getDescendantFields().concat(derivedFromItem);
        } else {
          return derivedFromItem;
        }
      })));
    }
  }]);

  return DerivedField;
}(_dataField.DataField);

exports.DerivedField = DerivedField;
exports.DerivedField = DerivedField = DerivedField_1 = (0, _tslib.__decorate)([_autobind2.default], DerivedField);
//# sourceMappingURL=derived-field.js.map