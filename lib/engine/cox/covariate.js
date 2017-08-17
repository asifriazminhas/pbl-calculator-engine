"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_types_1 = require("../common/field-types");
const datum_1 = require("../common/datum");
const rcs_custom_function_1 = require("./custom-functions/rcs-custom-function");
const derived_field_1 = require("./derived-field");
const interaction_covariate_1 = require("./interaction-covariate");
const env_1 = require("../common/env");
const field_1 = require("./field");
const moment = require("moment");
function formatCoefficent(covariate, coefficent) {
    if (!coefficent === null || coefficent === undefined) {
        return covariate.referencePoint;
    }
    if (coefficent instanceof moment) {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    }
    else if (coefficent === 'NA') {
        return covariate.referencePoint;
    }
    else if (!isNaN(coefficent)) {
        return Number(coefficent);
    }
    else if (isNaN(coefficent)) {
        return covariate.referencePoint;
    }
    else {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    }
}
function calculateComponent(covariate, coefficent) {
    var component = coefficent * covariate.beta;
    if (env_1.shouldLogDebugInfo()) {
        console.log(`Covariate ${covariate.name}`);
        console.log(`Input ${coefficent} ${coefficent === covariate.referencePoint ? 'Set to Reference Point' : ''}`);
        console.log(`PMML Beta ${covariate.beta}`);
        console.log(`Component ${component}`);
    }
    return component;
}
function getComponent(covariate, data) {
    if (env_1.shouldLogWarnings()) {
        console.groupCollapsed(`${covariate.name}`);
    }
    const component = calculateComponent(covariate, calculateCoefficent(covariate, data));
    if (env_1.shouldLogDebugInfo() === true) {
        console.groupEnd();
    }
    return component;
}
exports.getComponent = getComponent;
function calculateCoefficent(covariate, data) {
    const coefficentData = covariate.fieldType === field_types_1.FieldTypes.InteractionCovariate ? interaction_covariate_1.calculateDataToCalculateCoefficent(covariate, data) : calculateDataToCalculateCoefficent(covariate, data);
    let coefficent = 0;
    if (coefficentData.length === 1 && coefficentData[0].name === covariate.name) {
        coefficent = (coefficentData[0].coefficent);
    }
    else if (covariate.customFunction) {
        coefficent = rcs_custom_function_1.calculateCoefficent(covariate.customFunction, coefficentData);
    }
    else if (covariate.derivedField) {
        coefficent = derived_field_1.calculateCoefficent(covariate.derivedField, coefficentData);
    }
    return formatCoefficent(covariate, coefficent);
}
exports.calculateCoefficent = calculateCoefficent;
function calculateDataToCalculateCoefficent(covariate, data) {
    //Try to find a datum with the same name field in the data arg
    const datumFound = field_1.getDatumForField(covariate, data);
    //If we did not find anything then we need to calculate the coefficent using either a custom function or the coresponding derived field
    if (!datumFound) {
        //Custom function has higher priority
        if (covariate.customFunction) {
            return rcs_custom_function_1.calculateDataToCalculateCoefficent(covariate.customFunction, data);
        }
        else if (covariate.derivedField) {
            try {
                return derived_field_1.calculateDataToCalculateCoefficent(covariate.derivedField, data);
            }
            catch (err) {
                if (env_1.shouldLogWarnings()) {
                    console.warn(`Incomplete data to calculate coefficent for data field ${covariate.name}. Setting it to reference point`);
                }
                return [
                    datum_1.datumFactory(covariate.name, covariate.referencePoint)
                ];
            }
        }
        else {
            if (env_1.shouldLogWarnings()) {
                console.warn(`Incomplete data to calculate coefficent for data field ${covariate.name}. Setting it to reference point`);
            }
            return [
                datum_1.datumFromCovariateReferencePointFactory(covariate)
            ];
        }
    }
    else {
        return [
            datumFound
        ];
    }
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
//# sourceMappingURL=covariate.js.map