"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRestrictedCubicSplineCustomFunction = isRestrictedCubicSplineCustomFunction;
exports.parseRcsSpline = parseRcsSpline;

/**
 * Given a the label field for a Parameter XML node it checks if this predictor
 * has an RCS custom function or not. Eg. age_rcs2 has an rcs function
 *
 * @export
 * @param {string} parameterLabel
 * @returns
 */
function isRestrictedCubicSplineCustomFunction(parameterLabel) {
  return parameterLabel.indexOf('rcs') > -1;
}
/**
 * Gets the variable number of this rcs custom function. Eg. age_rcs2 will return 2
 *
 * @param {string} paramaterLabel
 * @returns
 */


function getSplineVariableNumber(paramaterLabel) {
  return Number( // Take the parameterLabel argument
  paramaterLabel // Split it up by _ since each modifier is preceeded by a _
  .split('_')
  /* Filter out all modified names which are not rcs ones and since
  there can be only one return the first value in the filtered array */
  .filter(function (modifierName) {
    return modifierName.indexOf('rcs') > -1;
  })[0]
  /* At this point the string is rcs[0-9] so split it by rcs and
  return the first value in the array which returns the number */
  .split('rcs')[1]);
}
/**
 * Returns the array of knots from the knotLocations field in a RestrictedCubicSpline.PCell node
 *
 * @param {string} knotLocations In the PMML file it is given as '[1, 2, 3, 4]'
 * @returns {Array<number>}
 */


function parseKnotLocations(knotLocations) {
  return knotLocations.split(', ').map(function (knotLocation) {
    return Number(knotLocation);
  });
}
/**
 * Returns the predictor name that represents the first rcs variable. Eg. age_rcs2 it would return age_rcs1
 *
 * @param {string} parameterLabel
 * @returns {string}r
 */


function parseFirstVariableName(parameterLabel) {
  // Replace the rcs modifier (_rcs{number}) with _rcs1
  return parameterLabel.replace(/_rcs[0-9]/, '_rcs1');
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
  var splineVariableNumber = getSplineVariableNumber(parameter.$.label);
  /* If it's 1 then we don't have to apply the spline function on it since
  the component can be calculated normally */

  if (splineVariableNumber === 1) {
    return undefined;
  } else {
    // Otherwise

    /* Get the RestrictredCubicSpline PCell for this predictor using the
    parameter name field */
    var restrictedCubicSplinePCell = (restrictedCubicSpline.PCell instanceof Array ? restrictedCubicSpline.PCell : [restrictedCubicSpline.PCell]).find(function (pCell) {
      return pCell.$.parameterName.indexOf(parameter.$.name) > -1;
    }); // If there isn't one then we have a problem

    if (!restrictedCubicSplinePCell) {
      throw new Error("No Restricted Cubic Spline Cell found for paramater ".concat(parameter.$.name));
    } else {
      // Otherwise Return the Spline object
      return {
        knots: parseKnotLocations(restrictedCubicSplinePCell.$.knotLocations),
        firstVariableCovariate: parseFirstVariableName(parameter.$.label),
        variableNumber: splineVariableNumber
      };
    }
  }
}
//# sourceMappingURL=rcs_custom_function.js.map