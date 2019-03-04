"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var DerivedField_1;
"use strict";
const data_field_1 = require("../data-field");
const lodash_1 = require("lodash");
const core_decorators_1 = require("core-decorators");
const covariate_1 = require("../covariate/covariate");
const undefined_1 = require("../../../util/undefined");
const errors_1 = require("../../errors");
const pmml_functions_1 = require("./pmml-functions");
const env_1 = require("../../../util/env");
const non_interaction_covariate_1 = require("../covariate/non-interaction-covariats/non-interaction-covariate");
const interaction_covariate_1 = require("../covariate/interaction-covariate/interaction-covariate");
const datum_1 = require("../../data/datum");
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
function getLeafFieldsForDerivedField(derivedField) {
    if (derivedField.derivedFrom.length === 0) {
        return [derivedField];
    }
    else {
        return lodash_1.flatten(derivedField.derivedFrom.map(derivedFromItem => {
            if (derivedFromItem instanceof DerivedField) {
                return getLeafFieldsForDerivedField(derivedFromItem);
            }
            else if (derivedFromItem instanceof covariate_1.Covariate) {
                if (derivedFromItem.derivedField) {
                    return getLeafFieldsForDerivedField(derivedFromItem.derivedField);
                }
                else {
                    return derivedFromItem;
                }
            }
            else {
                return derivedFromItem;
            }
        }));
    }
}
exports.getLeafFieldsForDerivedField = getLeafFieldsForDerivedField;
function findDescendantDerivedField(derivedField, name) {
    let foundDerivedField;
    derivedField.derivedFrom.every(derivedFromItem => {
        if (derivedFromItem.name === name) {
            if (derivedFromItem instanceof DerivedField) {
                foundDerivedField = derivedFromItem;
            }
        }
        else {
            if (derivedFromItem instanceof non_interaction_covariate_1.NonInteractionCovariate &&
                derivedFromItem.derivedField) {
                foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
            }
            else if (derivedFromItem instanceof interaction_covariate_1.InteractionCovariate) {
                foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
            }
            else if (derivedFromItem instanceof DerivedField) {
                foundDerivedField = findDescendantDerivedField(derivedFromItem, name);
            }
        }
        return foundDerivedField ? false : true;
    });
    return foundDerivedField;
}
exports.findDescendantDerivedField = findDescendantDerivedField;
let DerivedField = DerivedField_1 = class DerivedField extends data_field_1.DataField {
    constructor(derivedFieldJson, derivedFrom) {
        super(derivedFieldJson);
        this.name = derivedFieldJson.name;
        this.equation = derivedFieldJson.equation;
        this.derivedFrom = derivedFrom;
    }
    evaluateEquation(obj, userFunctions, tables) {
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
        eval(this.equation);
        return derived;
    }
    calculateCoefficent(data, userDefinedFunctions, tables) {
        /*Check if there is a datum for this intermediate predictor. If there is then we don't need to go further*/
        const datumForCurrentDerivedField = this.getDatumForField(data);
        if (datumForCurrentDerivedField) {
            return datumForCurrentDerivedField.coefficent;
        }
        else {
            /*Filter out all the datum which are not needed for the equation evaluation*/
            let dataForEvaluation = data.filter(datum => this.derivedFrom.find(derivedFromItem => derivedFromItem.name === datum.name)
                ? true
                : false);
            /*If we don't have all the data for evaluation when calculate it*/
            if (dataForEvaluation.length !== this.derivedFrom.length) {
                dataForEvaluation = this.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
            }
            if (env_1.shouldLogDebugInfo() === true) {
                console.groupCollapsed(`Derived Field: ${this.name}`);
                console.log(`Name: ${this.name}`);
                console.log(`Derived Field: ${this.equation}`);
                console.log(`Derived Field Data`);
                console.table(dataForEvaluation);
            }
            /*make the object with the all the data needed for the equation evaluation*/
            const obj = {};
            dataForEvaluation.forEach(datum => (obj[datum.name] = datum.coefficent));
            const evaluatedValue = this.evaluateEquation(obj, userDefinedFunctions, tables);
            if (env_1.shouldLogDebugInfo()) {
                console.log(`Evaluated value: ${evaluatedValue}`);
                console.groupEnd();
            }
            return evaluatedValue;
        }
    }
    calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
        /*Go through each explanatory predictor and calculate the coefficent for
        each which will be used for the evaluation*/
        return lodash_1.flatten(this.derivedFrom.map(derivedFromItem => {
            const datumFound = derivedFromItem.getDatumForField(data);
            if (datumFound) {
                return datumFound;
            }
            if (derivedFromItem instanceof covariate_1.Covariate) {
                return datum_1.datumFactoryFromDataField(derivedFromItem, derivedFromItem.calculateCoefficient(data, userDefinedFunctions, tables));
            }
            else if (derivedFromItem instanceof DerivedField_1) {
                return datum_1.datumFactoryFromDataField(derivedFromItem, derivedFromItem.calculateCoefficent(data, userDefinedFunctions, tables));
            }
            else {
                return {
                    name: derivedFromItem.name,
                    coefficent: undefined,
                };
            }
        }));
    }
    getDescendantFields() {
        return data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(this.derivedFrom.map(derivedFromItem => {
            if (derivedFromItem instanceof covariate_1.Covariate) {
                if (derivedFromItem.derivedField) {
                    return derivedFromItem.derivedField
                        .getDescendantFields()
                        .concat(derivedFromItem);
                }
                else {
                    return derivedFromItem;
                }
            }
            else if (derivedFromItem instanceof DerivedField_1) {
                return derivedFromItem
                    .getDescendantFields()
                    .concat(derivedFromItem);
            }
            else {
                return derivedFromItem;
            }
        })));
    }
};
DerivedField = DerivedField_1 = tslib_1.__decorate([
    core_decorators_1.autobind
], DerivedField);
exports.DerivedField = DerivedField;
//# sourceMappingURL=derived-field.js.map