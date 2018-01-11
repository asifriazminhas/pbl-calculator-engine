"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_function_1 = require("../../../custom-function");
/**
 * Given a the label field for a Parameter XML node it checks if this predictor has an RCS custom function or not. Eg. age_rcs2 has an rcs function
 *
 * @export
 * @param {string} parameterLabel
 * @returns
 */
function isRestrictedCubicSplineCustomFunction(parameterLabel) {
    return parameterLabel.indexOf('rcs') > -1;
}
exports.isRestrictedCubicSplineCustomFunction = isRestrictedCubicSplineCustomFunction;
/**
 * Gets the variable number of this rcs custom function. Eg. age_rcs2 will return 2
 *
 * @param {string} paramaterLabel
 * @returns
 */
function getSplineVariableNumber(paramaterLabel) {
    //Get the variable number for this spline custom function. eg. age_rcs1 it's 1
    return Number(paramaterLabel.split('rcs')[1]);
}
/**
 * Returns the array of knots from the knotLocations field in a RestrictedCubicSpline.PCell node
 *
 * @param {string} knotLocations In the PMML file it is given as '[1, 2, 3, 4]'
 * @returns {Array<number>}
 */
function parseKnotLocations(knotLocations) {
    return knotLocations.split(', ').map((knotLocation) => {
        return Number(knotLocation);
    });
}
/**
 * Returns the predictor name that represents the first rcs variable. Eg. age_rcs2 it would return age_rcs1
 *
 * @param {string} parameterLabel
 * @returns {string}
 */
function parseFirstVariableName(parameterLabel) {
    return parameterLabel.split('_rcs')[0].concat('_rcs1');
}
/**
 * Returns an RCSSpline object parsed from PMMML
 *
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns
 */
function parseRcsSpline(parameter, restrictedCubicSpline) {
    const splineVariableNumber = getSplineVariableNumber(parameter.$.label);
    //If it's 1 then we don't have to apply the spline function on it since the component can be calculated normally
    if (splineVariableNumber === 1) {
        return undefined;
    }
    else {
        //Get the RestrictredCubicSpline PCell for this predictor  using the parameter name field
        const restrictedCubicSplinePCell = restrictedCubicSpline.PCell
            .find((pCell) => {
            return pCell.$.parameterName.indexOf(parameter.$.name) > -1;
        });
        //If there isn't one then we have a problem
        if (!restrictedCubicSplinePCell) {
            throw new Error(`No Restricted Cubic Spline Cell found for paramater ${parameter.$.name}`);
        }
        else {
            return {
                customFunctionType: custom_function_1.CustomFunctionType.RcsCustomFunction,
                knots: parseKnotLocations(restrictedCubicSplinePCell.$.knotLocations),
                firstVariableCovariate: parseFirstVariableName(parameter.$.label),
                variableNumber: splineVariableNumber
            };
        }
    }
}
exports.parseRcsSpline = parseRcsSpline;
//# sourceMappingURL=rcs_custom_function.js.map