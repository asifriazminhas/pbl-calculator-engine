"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var margin_1 = require("./margin");

var error_code_1 = require("../error-code");

var Interval =
/*#__PURE__*/
function () {
  function Interval(intervalJson) {
    _classCallCheck(this, Interval);

    this.lowerMargin = intervalJson.lowerMargin ? new margin_1.Margin(intervalJson.lowerMargin) : undefined;
    this.higherMargin = intervalJson.higherMargin ? new margin_1.Margin(intervalJson.higherMargin) : undefined;
  }

  _createClass(Interval, [{
    key: "limitNumber",
    value: function limitNumber(num) {
      if (this.lowerMargin && this.validateLowerMargin(num) !== true) {
        return this.lowerMargin.margin;
      } else if (this.higherMargin && this.validateHigherMargin(num) !== true) {
        return this.higherMargin.margin;
      } else {
        return num;
      }
    }
    /**
     * Validates whether the num arg is greater than for an open margin or
     * greater than or equal to for a closed margin
     *
     * @param {number} num value to validate
     * @returns {(ErrorCode | true)} Returns an ErrorCode if validation
     * fails. True if validation passes.
     * @memberof Interval
     */

  }, {
    key: "validateLowerMargin",
    value: function validateLowerMargin(num) {
      if (this.lowerMargin) {
        var margin = this.lowerMargin.margin;

        if (this.lowerMargin.isOpen) {
          if (num <= margin) {
            return error_code_1.ErrorCode.LessThanOrEqualTo;
          } else if (num < margin) {
            return error_code_1.ErrorCode.LessThan;
          }
        }
      }

      return true;
    }
    /**
     * Validates whether the num arg is less than for an open margin or
     * less than or equal to for a closed margin
     * @param {number} num value to validate
     * @returns {(ErrorCode | true)} Returns an ErrorCode if validation fails.
     * True if validation passes.
     * @memberof Interval
     */

  }, {
    key: "validateHigherMargin",
    value: function validateHigherMargin(num) {
      if (this.higherMargin) {
        var margin = this.higherMargin.margin;

        if (this.higherMargin.isOpen) {
          if (num >= margin) {
            return error_code_1.ErrorCode.GreaterThanOrEqualTo;
          } else if (num > margin) {
            return error_code_1.ErrorCode.GreaterThan;
          }
        }
      }

      return true;
    }
  }]);

  return Interval;
}();

exports.Interval = Interval;
//# sourceMappingURL=interval.js.map