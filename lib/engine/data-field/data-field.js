"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataField = void 0;

var _autobind2 = _interopRequireDefault(require("core-decorators/lib/autobind"));

var _uniqWith2 = _interopRequireDefault(require("lodash/uniqWith"));

var _tslib = require("tslib");

var _interval = require("./covariate/interval");

var _errorCode = require("./error-code");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DataField_1;

var DataField = DataField_1 = /*#__PURE__*/function () {
  function DataField(fieldJson) {
    _classCallCheck(this, DataField);

    this.name = fieldJson.name;
    this.intervals = fieldJson.intervals ? fieldJson.intervals.map(function (interval) {
      return new _interval.Interval(interval);
    }) : undefined;
    this.categories = fieldJson.categories;
    this.isRequired = fieldJson.isRequired;
    this.metadata = fieldJson.metadata;
    this.isRecommended = fieldJson.isRecommended;
  }

  _createClass(DataField, [{
    key: "getDatumForField",
    value: function getDatumForField(data) {
      var _this = this;

      return data.find(function (datum) {
        return datum.name === _this.name;
      });
    }
  }, {
    key: "isFieldWithName",
    value: function isFieldWithName(name) {
      return this.name === name;
    }
    /**
     * Validates the Datum identical to this DataField in the data arg using
     * the interval and categories fields if present
     *
     * @param {Data[]} data Data to validate in the context of this DataField
     * @returns {(ErrorCode[] | true)} If validation failed, then error codes
     * representing all the validation errors is returned
     * @memberof DataField
     */

  }, {
    key: "validateData",
    value: function validateData(data) {
      var datumFound = this.getDatumForField(data);

      if (!datumFound) {
        return [_errorCode.ErrorCode.NoDatumFound];
      }

      var errorCodes = [];

      if (this.intervals) {
        var numberCoefficient = Number(datumFound.coefficent);
        var isEmptyString = typeof datumFound.coefficent === 'string' && datumFound.coefficent.trim().length === 0;

        if (isNaN(numberCoefficient) || isEmptyString) {
          errorCodes.push(_errorCode.ErrorCode.NotANumber);
        } else {
          // Go through each interval and validate the margins of each one.
          // If both margins are validated for any interval than
          // validation passes. Otherwise add to the list of error codes
          // if it hasn't already been added
          var _iterator = _createForOfIteratorHelper(this.intervals),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var interval = _step.value;
              var lowerMarginValidation = interval.validateLowerMargin(numberCoefficient);

              if (lowerMarginValidation !== true && errorCodes.indexOf(lowerMarginValidation) === -1) {
                errorCodes.push(lowerMarginValidation);
              }

              var higherMarginValidation = interval.validateHigherMargin(numberCoefficient);

              if (higherMarginValidation !== true && errorCodes.indexOf(higherMarginValidation) === -1) {
                errorCodes.push(higherMarginValidation);
              }

              if (lowerMarginValidation === true && higherMarginValidation === true) {
                return true;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      } // If categories field exists validate whether the coefficient is part of the accepted values


      if (this.categories) {
        // Try to find a category whose value field matches the coefficient
        var foundCategory = this.categories.find(function (category) {
          return category.value === datumFound.coefficent;
        }); // If no category was found then validation has failed

        if (!foundCategory) {
          errorCodes.push(_errorCode.ErrorCode.InvalidCategory);
        } else {
          // Otherwise validation passes
          return true;
        }
      }

      return errorCodes;
    }
  }, {
    key: "formatCoefficient",
    value: function formatCoefficient(coefficient) {
      if (coefficient instanceof _moment.default || coefficient instanceof Date) {
        throw new Error("Coefficent is not a number ".concat(this.name));
      } else {
        var formattedCoefficient = Number(coefficient);

        if (this.intervals) {
          // Find One interval where the coefficient is within it's bounds
          var validatedInterval = this.intervals.find(function (interval) {
            return interval.validate(formattedCoefficient);
          });

          if (validatedInterval) {
            return formattedCoefficient;
          } else {
            return this.intervals[0].limitNumber(formattedCoefficient);
          }
        }

        return formattedCoefficient;
      }
    }
  }], [{
    key: "getUniqueDataFields",
    value: function getUniqueDataFields(dataFields) {
      return (0, _uniqWith2.default)(dataFields, DataField_1.isSameDataField);
    }
  }, {
    key: "isSameDataField",
    value: function isSameDataField(dataFieldOne, dataFieldTwo) {
      return dataFieldOne.name === dataFieldTwo.name;
    }
  }, {
    key: "findDataFieldWithName",
    value: function findDataFieldWithName(dataFields, name) {
      return dataFields.find(function (dataField) {
        return dataField.name === name;
      });
    }
  }]);

  return DataField;
}();

exports.DataField = DataField;
exports.DataField = DataField = DataField_1 = (0, _tslib.__decorate)([_autobind2.default, (0, _tslib.__metadata)("design:paramtypes", [Object])], DataField);
//# sourceMappingURL=data-field.js.map