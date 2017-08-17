"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_1 = require("./field");
const field_types_1 = require("../common/field-types");
const _ = require("lodash");
const datum_1 = require("../common/datum");
const covariate_1 = require("./covariate");
const pmml_functions_1 = require("./pmml-functions");
const env_1 = require("../common/env");
function evaluateEquation(derivedField, obj) {
    obj;
    let derived = undefined;
    let func = pmml_functions_1.default;
    func;
    eval(derivedField.equation);
    return derived;
}
function calculateCoefficent(derivedField, data) {
    //Check if there is a datum for this intermediate predictor. If there is then we don't need to go further
    const datumForCurrentDerivedField = field_1.getDatumForField(derivedField, data);
    if (datumForCurrentDerivedField) {
        return datumForCurrentDerivedField.coefficent;
    }
    else {
        //Filter out all the datum which are not needed for the equation evaluation
        let dataForEvaluation = data
            .filter(datum => derivedField.derivedFrom
            .find(derivedFromItem => derivedFromItem.name === datum.name) ? true : false);
        //If we don't have all the data for evaluation when calculate it
        if (dataForEvaluation.length !== derivedField.derivedFrom.length) {
            dataForEvaluation = calculateDataToCalculateCoefficent(derivedField, data);
        }
        if (env_1.shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Derived Field: ${derivedField.name}`);
            console.log(`Name: ${derivedField.name}`);
            console.log(`Derived Field: ${derivedField.equation}`);
            console.log(`Derived Field Data`);
            console.table(dataForEvaluation);
        }
        //make the object with the all the data needed for the equation evaluation
        const obj = {};
        dataForEvaluation.forEach(datum => obj[datum.name] = datum.coefficent);
        const evaluatedValue = evaluateEquation(derivedField, obj);
        if (env_1.shouldLogDebugInfo()) {
            console.log(`Evaluated value: ${evaluatedValue}`);
            console.groupEnd();
        }
        return evaluatedValue;
    }
}
exports.calculateCoefficent = calculateCoefficent;
function calculateDataToCalculateCoefficent(derivedField, data) {
    //Go through each explanatory predictor and calculate the coefficent for each which will be used for the evaluation
    return _.flatten(derivedField.derivedFrom
        .map((derivedFromItem) => {
        const fieldName = derivedFromItem.name;
        if (derivedFromItem.fieldType === field_types_1.FieldTypes.InteractionCovariate || derivedFromItem.fieldType === field_types_1.FieldTypes.NonInteractionCovariate) {
            return datum_1.datumFactory(fieldName, covariate_1.calculateCoefficent(derivedFromItem, data));
        }
        else if (derivedFromItem.fieldType === field_types_1.FieldTypes.DerivedField) {
            return datum_1.datumFactory(fieldName, calculateCoefficent(derivedFromItem, data));
        }
        else {
            const datumFound = field_1.getDatumForField(derivedFromItem, data);
            if (!datumFound) {
                throw new Error(``);
            }
            else {
                return datumFound;
            }
        }
    }));
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
//# sourceMappingURL=derived-field.js.map