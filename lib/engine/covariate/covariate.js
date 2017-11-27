"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interaction_covariate_1 = require("./interaction-covariate");
const base_covariate_1 = require("./base-covariate");
const env_1 = require("../env");
const data_1 = require("../data");
const field_1 = require("../field");
// tslint:disable-next-line
const custom_function_1 = require("../custom-function");
const derived_field_1 = require("../derived-field");
function calculateComponent(covariate, coefficent) {
    const component = coefficent * covariate.beta;
    if (env_1.shouldLogDebugInfo()) {
        console.log(`Covariate ${covariate.name}`);
        console.log(`Input ${coefficent} ${coefficent === covariate.referencePoint
            ? 'Set to Reference Point'
            : ''}`);
        console.log(`PMML Beta ${covariate.beta}`);
        console.log(`Component ${component}`);
    }
    return component;
}
function getComponent(covariate, data, userFunctions) {
    if (env_1.shouldLogWarnings()) {
        console.groupCollapsed(`${covariate.name}`);
    }
    const component = calculateComponent(covariate, calculateCoefficent(covariate, data, userFunctions));
    if (env_1.shouldLogDebugInfo() === true) {
        console.groupEnd();
    }
    return component;
}
exports.getComponent = getComponent;
function calculateCoefficent(covariate, data, userDefinedFunctions) {
    const coefficentData = covariate.fieldType === field_1.FieldType.InteractionCovariate
        ? interaction_covariate_1.calculateDataToCalculateCoefficent(covariate, data, userDefinedFunctions)
        : base_covariate_1.calculateDataToCalculateCoefficent(covariate, data, userDefinedFunctions);
    let coefficent = 0;
    if (coefficentData.length === 1 &&
        coefficentData[0].name === covariate.name) {
        coefficent = coefficentData[0].coefficent;
    }
    else if (covariate.customFunction) {
        coefficent = custom_function_1.calculateCoefficent(covariate.customFunction, coefficentData);
    }
    else if (covariate.derivedField) {
        coefficent = derived_field_1.calculateCoefficent(covariate.derivedField, coefficentData, userDefinedFunctions);
    }
    return data_1.formatCoefficentForComponent(coefficent, covariate);
}
exports.calculateCoefficent = calculateCoefficent;
//# sourceMappingURL=covariate.js.map