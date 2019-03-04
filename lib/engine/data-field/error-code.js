"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Enum of error codes that can be returned by methods that validate Data
 *
 * @export
 * @enum {number}
 */

var ErrorCode;

(function (ErrorCode) {
  /**
   * Returned when no Datum object is found for a DataField within a Data
   * array
   */
  ErrorCode[ErrorCode["NoDatumFound"] = 0] = "NoDatumFound";
  /**
   * Returned when the coefficient of a Datum object is less than or equal to
   * the value of an open margin
   */

  ErrorCode[ErrorCode["LessThanOrEqualTo"] = 1] = "LessThanOrEqualTo";
  /**
   * Returned when the coefficient of a Datum object is less than the value of
   * a closed margin
   */

  ErrorCode[ErrorCode["LessThan"] = 2] = "LessThan";
  /**
   * Returned when the coefficient of a Datum object is greater than or equal
   * to the value of a open margin
   */

  ErrorCode[ErrorCode["GreaterThanOrEqualTo"] = 3] = "GreaterThanOrEqualTo";
  /**
   * Returned when the coefficient of a Datum object is greater than the value
   * of a closed margin
   */

  ErrorCode[ErrorCode["GreaterThan"] = 4] = "GreaterThan";
  /**
   * Returned when the coefficient of a Datum object does not match one of the
   * allowed category values in the categories fields
   */

  ErrorCode[ErrorCode["InvalidCategory"] = 5] = "InvalidCategory";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
//# sourceMappingURL=error-code.js.map