"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["Incomplete data to calculate coefficent for\n                        datafield ", ". Setting it to reference point"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["Incomplete data to calculate coefficent for\n                            data field ", ". Setting it to reference\n                            point"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

var data_field_1 = require("../data-field");

var data_1 = require("../../data");

var moment = require("moment");

var common_tags_1 = require("common-tags");

var env_1 = require("../../../util/env");

var core_decorators_1 = require("core-decorators");

var datum_1 = require("../../data/datum");

var data_2 = require("../../data/data");

var errors_1 = require("../../errors");

var Covariate =
/*#__PURE__*/
function (_data_field_1$DataFie) {
  _inherits(Covariate, _data_field_1$DataFie);

  function Covariate(covariateJson, customFunction, derivedField) {
    var _this;

    _classCallCheck(this, Covariate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Covariate).call(this, covariateJson));
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
      if (env_1.shouldLogWarnings()) {
        console.groupCollapsed("".concat(this.name));
      }

      var component = this.calculateComponent(this.calculateCoefficient(data, userFunctions, tables));

      if (env_1.shouldLogDebugInfo() === true) {
        console.groupEnd();
      }

      return component;
    }
  }, {
    key: "calculateCoefficient",
    value: function calculateCoefficient(data, userDefinedFunctions, tables) {
      var coefficent = 0;

      try {
        coefficent = data_2.findDatumWithName(this.name, data).coefficent;
      } catch (err) {
        if (err instanceof errors_1.NoDatumFoundError) {
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
      return formattedCoefficent === undefined ? 0 : formattedCoefficent;
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
            if (env_1.shouldLogWarnings()) {
              console.warn(common_tags_1.oneLine(_templateObject(), this.name));
            }

            return [datum_1.datumFactoryFromDataField(this, this.referencePoint)];
          }
        } else {
          // Fall back to setting it to reference point
          if (env_1.shouldLogWarnings()) {
            console.warn(common_tags_1.oneLine(_templateObject2(), this.name));
          }

          return [data_1.datumFromCovariateReferencePointFactory(this)];
        }
      } else {
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
      return this.derivedField ? this.derivedField.getDescendantFields() : [];
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

      if (env_1.shouldLogDebugInfo()) {
        console.log("Covariate ".concat(this.name));
        console.log("Input ".concat(coefficent, " ").concat(coefficent === this.referencePoint ? 'Set to Reference Point' : ''));
        console.log("PMML Beta ".concat(this.beta));
        console.log("Component ".concat(component));
      }

      return component;
    }
  }, {
    key: "formatCoefficentForComponent",
    value: function formatCoefficentForComponent(coefficent) {
      if (coefficent instanceof moment || coefficent instanceof Date) {
        throw new Error("Coefficent is not a number ".concat(this.name));
      } else if (coefficent === null || coefficent === undefined || coefficent === 'NA' || isNaN(coefficent)) {
        return this.referencePoint;
      } else {
        var formattedCoefficient = Number(coefficent);
        return this.interval ? this.interval.limitNumber(formattedCoefficient) : formattedCoefficient;
      }
    }
  }]);

  return Covariate;
}(data_field_1.DataField);

Covariate = tslib_1.__decorate([core_decorators_1.autobind], Covariate);
exports.Covariate = Covariate;
//# sourceMappingURL=covariate.js.map