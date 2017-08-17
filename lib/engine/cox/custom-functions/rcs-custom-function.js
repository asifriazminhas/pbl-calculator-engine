"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("../covariate");
const field_1 = require("../field");
//Calculates the first term in the spline equation
function getFirstTerm(rcsCustomFunction, firstVariableValue) {
    const numerator = firstVariableValue - rcsCustomFunction.knots[rcsCustomFunction.variableNumber - 2];
    const denominator = Math.pow(rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] - rcsCustomFunction.knots[0], (2 / 3));
    return Math.pow(Math.max(numerator / denominator, 0), 3);
}
//Calculates the second term in the spline equation
function getSecondTerm(rcsCustomFunction, firstVariableValue) {
    const coefficentNumerator = rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] - rcsCustomFunction.knots[rcsCustomFunction.variableNumber - 2];
    const coefficentDenominator = rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] - rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2];
    const coefficent = coefficentNumerator / coefficentDenominator;
    const numerator = firstVariableValue - rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2];
    const denominator = Math.pow(rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] - rcsCustomFunction.knots[0], (2 / 3));
    return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
}
//Calculates the third term inthe spline equation
function getThirdTerm(rcsCustomFunction, firstVariableValue) {
    const coefficentNumerator = rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2] - rcsCustomFunction.knots[rcsCustomFunction.variableNumber - 2];
    const coefficentDenominator = rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] - rcsCustomFunction.knots[rcsCustomFunction.knots.length - 2];
    const coefficent = coefficentNumerator / coefficentDenominator;
    const numerator = firstVariableValue - rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1];
    const denominator = Math.pow(rcsCustomFunction.knots[rcsCustomFunction.knots.length - 1] - rcsCustomFunction.knots[0], (2 / 3));
    return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
}
/**
 * Evaluates this custom function
 *
 * @param {EvaluateArgs} args
 * @returns {number}
 *
 * @memberOf Spline
 */
function calculateCoefficent(rcsCustomFunction, data) {
    const datumValue = getDataToCalculateCoefficent(rcsCustomFunction, data).coefficent;
    return getFirstTerm(rcsCustomFunction, datumValue) -
        getSecondTerm(rcsCustomFunction, datumValue) +
        getThirdTerm(rcsCustomFunction, datumValue);
}
exports.calculateCoefficent = calculateCoefficent;
/**
 * Returns the Datum object which is used in coefficent calculation
 *
 * @param {Array<Datum>} data
 * @returns {Datum}
 *
 * @memberOf RCSSpline
 */
function getDataToCalculateCoefficent(rcsCustomFunction, data) {
    //get the datum object for the first variable predictor
    const datumFound = data
        .find(datum => field_1.isFieldWithName(rcsCustomFunction.firstVariableCovariate, datum.name));
    //if we found one then we are good otherwise throw an error
    if (datumFound) {
        return datumFound;
    }
    else {
        throw new Error(`No Datum found for Predictor with name ${rcsCustomFunction.firstVariableCovariate.name}`);
    }
}
function calculateDataToCalculateCoefficent(rcsCustomFunction, data) {
    return [
        {
            name: rcsCustomFunction.firstVariableCovariate.name,
            coefficent: covariate_1.calculateCoefficent(rcsCustomFunction.firstVariableCovariate, data)
        }
    ];
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
//# sourceMappingURL=rcs-custom-function.js.map