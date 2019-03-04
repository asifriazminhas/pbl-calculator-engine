"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_rcs_custom_function_1 = require("./json-rcs-custom-function");
const json_derived_field_1 = require("./json-derived-field");
const data_field_type_1 = require("./data-field-type");
const interaction_covariate_1 = require("../../engine/data-field/covariate/interaction-covariate/interaction-covariate");
/* tslint:disable-next-line */
const non_interaction_covariate_1 = require("../../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate");
function findCovariateJsonWithName(covariateJsons, name) {
    return covariateJsons.find(covariateJson => covariateJson.name === name);
}
exports.findCovariateJsonWithName = findCovariateJsonWithName;
function parseCovariateJsonToCovariate(covariateJson, covariateJsons, derivedFieldJsons) {
    const derivedFieldJsonForCovariateJson = json_derived_field_1.findDerivedFieldJsonWithName(derivedFieldJsons, covariateJson.name);
    const parsedDerivedField = derivedFieldJsonForCovariateJson
        ? json_derived_field_1.parseDerivedFieldJsonToDerivedField(derivedFieldJsonForCovariateJson, derivedFieldJsons, covariateJsons)
        : undefined;
    const parsedCustomFunction = covariateJson.customFunction
        ? json_rcs_custom_function_1.parseRcsCustomFunctionJsonToRcsCustomFunction(covariateJson.customFunction, covariateJsons, derivedFieldJsons)
        : undefined;
    if (covariateJson.dataFieldType === data_field_type_1.DataFieldType.InteractionCovariate) {
        if (!parsedDerivedField) {
            throw new Error(`No derived field found for interaction covariate ${covariateJson.name}`);
        }
        else {
            return new interaction_covariate_1.InteractionCovariate(covariateJson, parsedCustomFunction, parsedDerivedField);
        }
    }
    else {
        return new non_interaction_covariate_1.NonInteractionCovariate(covariateJson, parsedCustomFunction, parsedDerivedField);
    }
}
exports.parseCovariateJsonToCovariate = parseCovariateJsonToCovariate;
//# sourceMappingURL=json-covariate.js.map