"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = require("tslib");

var DataField_1;
"use strict";

var core_decorators_1 = require("core-decorators");

var lodash_1 = require("lodash");

var interval_1 = require("./covariate/interval");

var error_code_1 = require("./error-code");

var DataField = DataField_1 =
/*#__PURE__*/
function () {
  function DataField(fieldJson) {
    _classCallCheck(this, DataField);

    this.name = fieldJson.name;
    this.interval = fieldJson.interval ? new interval_1.Interval(fieldJson.interval) : undefined;
    this.isRequired = fieldJson.isRequired;
    this.metadata = fieldJson.metadata;
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
     * @returns {(ErrorCode | true)} If validation failed, then an ErrorCode
     * representing the error will be returned. Otherwise true will be
     * returned
     * @memberof DataField
     */

  }, {
    key: "validateData",
    value: function validateData(data) {
      var datumFound = this.getDatumForField(data);

      if (!datumFound) {
        return error_code_1.ErrorCode.NoDatumFound;
      }

      if (this.interval) {
        var numberCoefficient = Number(datumFound.coefficent);
        var lowerMarginValidation = this.interval.validateLowerMargin(numberCoefficient);

        if (lowerMarginValidation !== true) {
          return lowerMarginValidation;
        }

        var higherMarginValidation = this.interval.validateHigherMargin(numberCoefficient);

        if (higherMarginValidation !== true) {
          return higherMarginValidation;
        }
      } // If categories field exists validate whether the coefficient is part of the accepted values


      if (this.categories) {
        // Try to find a category whose value field matches the coefficient
        var foundCategory = this.categories.find(function (category) {
          return category.value === datumFound.coefficent;
        }); // If no category was found then validation has failed

        if (!foundCategory) {
          return error_code_1.ErrorCode.InvalidCategory;
        }
      }

      return true;
    }
  }], [{
    key: "getUniqueDataFields",
    value: function getUniqueDataFields(dataFields) {
      return lodash_1.uniqWith(dataFields, DataField_1.isSameDataField);
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

DataField = DataField_1 = tslib_1.__decorate([core_decorators_1.autobind], DataField);
exports.DataField = DataField;
//# sourceMappingURL=data-field.js.map