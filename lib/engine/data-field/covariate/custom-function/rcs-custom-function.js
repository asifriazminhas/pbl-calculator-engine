"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const data_1 = require("../../../data");
const core_decorators_1 = require("core-decorators");
const datum_1 = require("../../../data/datum");
let RcsCustomFunction = class RcsCustomFunction {
    constructor(rcsCustomFunctionJson, firstVariableCovariate) {
        this.knots = rcsCustomFunctionJson.knots;
        this.variableNumber = rcsCustomFunctionJson.variableNumber;
        this.firstVariableCovariate = firstVariableCovariate;
    }
    calculateCoefficient(data) {
        const datumValue = data_1.findDatumWithName(this.firstVariableCovariate.name, data).coefficent;
        const coefficent = this.getFirstTerm(datumValue) -
            this.getSecondTerm(datumValue) +
            this.getThirdTerm(datumValue);
        return coefficent;
    }
    calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
        return [
            datum_1.datumFactoryFromDataField(this.firstVariableCovariate, this.firstVariableCovariate.calculateCoefficient(data, userDefinedFunctions, tables)),
        ];
    }
    // Calculates the first term in the spline equation
    getFirstTerm(firstVariableValue) {
        const numerator = firstVariableValue - this.knots[this.variableNumber - 2];
        const denominator = Math.pow(this.knots[this.knots.length - 1] - this.knots[0], 2 / 3);
        return Math.pow(Math.max(numerator / denominator, 0), 3);
    }
    //Calculates the second term in the spline equation
    getSecondTerm(firstVariableValue) {
        const coefficentNumerator = this.knots[this.knots.length - 1] -
            this.knots[this.variableNumber - 2];
        const coefficentDenominator = this.knots[this.knots.length - 1] -
            this.knots[this.knots.length - 2];
        const coefficent = coefficentNumerator / coefficentDenominator;
        const numerator = firstVariableValue - this.knots[this.knots.length - 2];
        const denominator = Math.pow(this.knots[this.knots.length - 1] - this.knots[0], 2 / 3);
        return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
    }
    //Calculates the third term inthe spline equation
    getThirdTerm(firstVariableValue) {
        const coefficentNumerator = this.knots[this.knots.length - 2] -
            this.knots[this.variableNumber - 2];
        const coefficentDenominator = this.knots[this.knots.length - 1] -
            this.knots[this.knots.length - 2];
        const coefficent = coefficentNumerator / coefficentDenominator;
        const numerator = firstVariableValue - this.knots[this.knots.length - 1];
        const denominator = Math.pow(this.knots[this.knots.length - 1] - this.knots[0], 2 / 3);
        return coefficent * Math.pow(Math.max(numerator / denominator, 0), 3);
    }
};
RcsCustomFunction = tslib_1.__decorate([
    core_decorators_1.autobind
], RcsCustomFunction);
exports.RcsCustomFunction = RcsCustomFunction;
//# sourceMappingURL=rcs-custom-function.js.map