"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCustomFunction = parseCustomFunction;

var _rcs_custom_function = require("./rcs_custom_function");

/**
 * Returns a CustomFunction object if one exists for a predictor or null
 *
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
//TODO Fix this so that the knots are in an Extension node
function parseCustomFunction(parameter, restrictedCubicSpline) {
  //Is it a Spline custom function? If it is
  if ((0, _rcs_custom_function.isRestrictedCubicSplineCustomFunction)(parameter.$.label)) {
    return (0, _rcs_custom_function.parseRcsSpline)(parameter, restrictedCubicSpline);
  } else {
    //Don't know what custom function it is. So return null.
    return undefined;
  }
}
//# sourceMappingURL=custom_function.js.map