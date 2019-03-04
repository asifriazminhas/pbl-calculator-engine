"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rcs_custom_function_1 = require("./rcs_custom_function");
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
    if (rcs_custom_function_1.isRestrictedCubicSplineCustomFunction(parameter.$.label)) {
        return rcs_custom_function_1.parseRcsSpline(parameter, restrictedCubicSpline);
    }
    else {
        //Don't know what custom function it is. So return null.
        return undefined;
    }
}
exports.parseCustomFunction = parseCustomFunction;
//# sourceMappingURL=custom_function.js.map