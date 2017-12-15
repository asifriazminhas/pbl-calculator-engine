"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_1 = require("../field");
const field_2 = require("../field");
const lodash_1 = require("lodash");
const data_1 = require("../data");
const covariate_1 = require("../covariate");
const pmml_functions_1 = require("../cox/pmml-functions");
const env_1 = require("../env");
const undefined_1 = require("../undefined");
const errors_1 = require("../errors");
function getValueFromTable(table, outputColumn, conditions) {
    const conditionTableColumns = Object.keys(conditions);
    return undefined_1.throwErrorIfUndefined(table.find(row => {
        return conditionTableColumns.find(conditionColumn => {
            // tslint:disable-next-line
            return row[conditionColumn] != conditions[conditionColumn];
        })
            ? false
            : true;
    }), new errors_1.NoTableRowFoundError(conditions))[outputColumn];
}
// tslint:disable-next-line
getValueFromTable;
function evaluateEquation(derivedField, obj, userFunctions, tables) {
    // tslint:disable-next-line
    obj;
    // tslint:disable-next-line
    userFunctions;
    // tslint:disable-next-line
    tables;
    // tslint:disable-next-line
    let derived = undefined;
    // tslint:disable-next-line
    let func = pmml_functions_1.default;
    // tslint:disable-next-line
    func;
    eval(derivedField.equation);
    return derived;
}
function calculateCoefficent(derivedField, data, userDefinedFunctions, tables) {
    /*Check if there is a datum for this intermediate predictor. If there is then we don't need to go further*/
    const datumForCurrentDerivedField = field_1.getDatumForField(derivedField, data);
    if (datumForCurrentDerivedField) {
        return datumForCurrentDerivedField.coefficent;
    }
    else {
        /*Filter out all the datum which are not needed for the equation evaluation*/
        let dataForEvaluation = data.filter(datum => derivedField.derivedFrom.find(derivedFromItem => derivedFromItem.name === datum.name)
            ? true
            : false);
        /*If we don't have all the data for evaluation when calculate it*/
        if (dataForEvaluation.length !== derivedField.derivedFrom.length) {
            dataForEvaluation = calculateDataToCalculateCoefficent(derivedField, data, userDefinedFunctions, tables);
        }
        if (env_1.shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Derived Field: ${derivedField.name}`);
            console.log(`Name: ${derivedField.name}`);
            console.log(`Derived Field: ${derivedField.equation}`);
            console.log(`Derived Field Data`);
            console.table(dataForEvaluation);
        }
        /*make the object with the all the data needed for the equation evaluation*/
        const obj = {};
        dataForEvaluation.forEach(datum => (obj[datum.name] = datum.coefficent));
        const evaluatedValue = evaluateEquation(derivedField, obj, userDefinedFunctions, tables);
        if (env_1.shouldLogDebugInfo()) {
            console.log(`Evaluated value: ${evaluatedValue}`);
            console.groupEnd();
        }
        return evaluatedValue;
    }
}
exports.calculateCoefficent = calculateCoefficent;
function calculateDataToCalculateCoefficent(derivedField, data, userDefinedFunctions, tables) {
    /*Go through each explanatory predictor and calculate the coefficent for
    each which will be used for the evaluation*/
    return lodash_1.flatten(derivedField.derivedFrom.map(derivedFromItem => {
        const fieldName = derivedFromItem.name;
        if (derivedFromItem.fieldType === field_2.FieldType.InteractionCovariate ||
            derivedFromItem.fieldType === field_2.FieldType.NonInteractionCovariate) {
            return data_1.datumFactory(fieldName, covariate_1.calculateCoefficent(derivedFromItem, data, userDefinedFunctions, tables));
        }
        else if (derivedFromItem.fieldType === field_2.FieldType.DerivedField) {
            return data_1.datumFactory(fieldName, calculateCoefficent(derivedFromItem, data, userDefinedFunctions, tables));
        }
        else {
            const datumFound = field_1.getDatumForField(derivedFromItem, data);
            if (!datumFound) {
                return {
                    name: derivedField.name,
                    coefficent: null,
                };
            }
            else {
                return datumFound;
            }
        }
    }));
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
function getLeafFieldsForDerivedField(derivedField) {
    if (derivedField.derivedFrom.length === 0) {
        return [derivedField];
    }
    else {
        return lodash_1.flatten(derivedField.derivedFrom.map(derivedFromItem => {
            if (derivedFromItem.fieldType === field_2.FieldType.DataField) {
                return derivedFromItem;
            }
            else if (derivedFromItem.fieldType === field_2.FieldType.DerivedField) {
                return getLeafFieldsForDerivedField(derivedFromItem);
            }
            else {
                if (derivedFromItem.derivedField) {
                    return getLeafFieldsForDerivedField(derivedFromItem.derivedField);
                }
                else {
                    return derivedFromItem;
                }
            }
        }));
    }
}
exports.getLeafFieldsForDerivedField = getLeafFieldsForDerivedField;
function findDescendantDerivedField(derivedField, name) {
    let foundDerivedField;
    derivedField.derivedFrom.every(derivedFromItem => {
        if (derivedFromItem.name === name) {
            if (derivedFromItem.fieldType === field_2.FieldType.DerivedField) {
                foundDerivedField = derivedFromItem;
            }
        }
        else {
            if (derivedFromItem.fieldType ===
                field_2.FieldType.NonInteractionCovariate &&
                derivedFromItem.derivedField) {
                foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
            }
            else if (derivedFromItem.fieldType === field_2.FieldType.InteractionCovariate) {
                foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
            }
            else if (derivedFromItem.fieldType === field_2.FieldType.DerivedField) {
                foundDerivedField = findDescendantDerivedField(derivedFromItem, name);
            }
        }
        return foundDerivedField ? false : true;
    });
    return foundDerivedField;
}
exports.findDescendantDerivedField = findDescendantDerivedField;
//# sourceMappingURL=derived-field.js.map