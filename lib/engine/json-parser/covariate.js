"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const derived_field_1 = require("./derived-field");
const field_types_1 = require("../common/field-types");
const custom_function_1 = require("./custom-functions/custom-function");
function findCovariateJsonWithName(covariateJsons, name) {
    return covariateJsons
        .find(covariateJson => covariateJson.name === name);
}
exports.findCovariateJsonWithName = findCovariateJsonWithName;
function parseCovariateJsonToCovariate(covariateJson, covariateJsons, derivedFieldJsons) {
    const derivedFieldJsonForCovariateJson = derived_field_1.findDerivedFieldJsonWithName(derivedFieldJsons, covariateJson.name);
    const parsedDerivedField = derivedFieldJsonForCovariateJson ? derived_field_1.parseDerivedFieldJsonToDerivedField(derivedFieldJsonForCovariateJson, derivedFieldJsons, covariateJsons) : undefined;
    const parsedCustomFunction = covariateJson.customFunction ? custom_function_1.parseCustomFunctionJsonToCustomFunction(covariateJson.customFunction, covariateJsons, derivedFieldJsons) : undefined;
    if (covariateJson.fieldType === field_types_1.FieldTypes.InteractionCovariate) {
        if (!parsedDerivedField) {
            throw new Error();
        }
        else {
            return Object.assign({}, covariateJson, {
                derivedField: parsedDerivedField,
                customFunction: parsedCustomFunction
            });
        }
    }
    else {
        return Object.assign({}, covariateJson, {
            derivedField: parsedDerivedField,
            customFunction: parsedCustomFunction
        });
    }
}
exports.parseCovariateJsonToCovariate = parseCovariateJsonToCovariate;
//# sourceMappingURL=covariate.js.map