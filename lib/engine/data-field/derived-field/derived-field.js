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

var tslib_1 = require("tslib");

var DerivedField_1;
"use strict";

var data_field_1 = require("../data-field");

var lodash_1 = require("lodash");

var core_decorators_1 = require("core-decorators");

var covariate_1 = require("../covariate/covariate");

var undefined_1 = require("../../../util/undefined");

var errors_1 = require("../../errors");

var pmml_functions_1 = require("./pmml-functions");

var env_1 = require("../../../util/env");

var non_interaction_covariate_1 = require("../covariate/non-interaction-covariats/non-interaction-covariate");

var interaction_covariate_1 = require("../covariate/interaction-covariate/interaction-covariate");

var datum_1 = require("../../data/datum");

function getValueFromTable(table, outputColumn, conditions) {
  var conditionTableColumns = Object.keys(conditions);
  return undefined_1.throwErrorIfUndefined(table.find(function (row) {
    return conditionTableColumns.find(function (conditionColumn) {
      // tslint:disable-next-line
      return row[conditionColumn] != conditions[conditionColumn];
    }) ? false : true;
  }), new errors_1.NoTableRowFoundError(conditions))[outputColumn];
} // tslint:disable-next-line


getValueFromTable;

function getLeafFieldsForDerivedField(derivedField) {
  if (derivedField.derivedFrom.length === 0) {
    return [derivedField];
  } else {
    return lodash_1.flatten(derivedField.derivedFrom.map(function (derivedFromItem) {
      if (derivedFromItem instanceof DerivedField) {
        return getLeafFieldsForDerivedField(derivedFromItem);
      } else if (derivedFromItem instanceof covariate_1.Covariate) {
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

exports.getLeafFieldsForDerivedField = getLeafFieldsForDerivedField;

function findDescendantDerivedField(derivedField, name) {
  var foundDerivedField;
  derivedField.derivedFrom.every(function (derivedFromItem) {
    if (derivedFromItem.name === name) {
      if (derivedFromItem instanceof DerivedField) {
        foundDerivedField = derivedFromItem;
      }
    } else {
      if (derivedFromItem instanceof non_interaction_covariate_1.NonInteractionCovariate && derivedFromItem.derivedField) {
        foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
      } else if (derivedFromItem instanceof interaction_covariate_1.InteractionCovariate) {
        foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
      } else if (derivedFromItem instanceof DerivedField) {
        foundDerivedField = findDescendantDerivedField(derivedFromItem, name);
      }
    }

    return foundDerivedField ? false : true;
  });
  return foundDerivedField;
}

exports.findDescendantDerivedField = findDescendantDerivedField;

var DerivedField = DerivedField_1 =
/*#__PURE__*/
function (_data_field_1$DataFie) {
  _inherits(DerivedField, _data_field_1$DataFie);

  function DerivedField(derivedFieldJson, derivedFrom) {
    var _this;

    _classCallCheck(this, DerivedField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedField).call(this, derivedFieldJson));
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

      var func = pmml_functions_1.default; // tslint:disable-next-line

      func;
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

        if (env_1.shouldLogDebugInfo() === true) {
          console.groupCollapsed("Derived Field: ".concat(this.name));
          console.log("Name: ".concat(this.name));
          console.log("Derived Field: ".concat(this.equation));
          console.log("Derived Field Data");
          console.table(dataForEvaluation);
        }
        /*make the object with the all the data needed for the equation evaluation*/


        var obj = {};
        dataForEvaluation.forEach(function (datum) {
          return obj[datum.name] = datum.coefficent;
        });
        var evaluatedValue = this.evaluateEquation(obj, userDefinedFunctions, tables);

        if (env_1.shouldLogDebugInfo()) {
          console.log("Evaluated value: ".concat(evaluatedValue));
          console.groupEnd();
        }

        return evaluatedValue;
      }
    }
  }, {
    key: "calculateDataToCalculateCoefficent",
    value: function calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
      /*Go through each explanatory predictor and calculate the coefficent for
      each which will be used for the evaluation*/
      return lodash_1.flatten(this.derivedFrom.map(function (derivedFromItem) {
        var datumFound = derivedFromItem.getDatumForField(data);

        if (datumFound) {
          return datumFound;
        }

        if (derivedFromItem instanceof covariate_1.Covariate) {
          return datum_1.datumFactoryFromDataField(derivedFromItem, derivedFromItem.calculateCoefficient(data, userDefinedFunctions, tables));
        } else if (derivedFromItem instanceof DerivedField_1) {
          return datum_1.datumFactoryFromDataField(derivedFromItem, derivedFromItem.calculateCoefficent(data, userDefinedFunctions, tables));
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
      return data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(this.derivedFrom.map(function (derivedFromItem) {
        if (derivedFromItem instanceof covariate_1.Covariate) {
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
}(data_field_1.DataField);

DerivedField = DerivedField_1 = tslib_1.__decorate([core_decorators_1.autobind], DerivedField);
exports.DerivedField = DerivedField;
//# sourceMappingURL=derived-field.js.map