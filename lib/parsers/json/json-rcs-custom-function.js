"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rcs_custom_function_1 = require("../../engine/data-field/covariate/custom-function/rcs-custom-function");
const json_covariate_1 = require("./json-covariate");
function parseRcsCustomFunctionJsonToRcsCustomFunction(rcsCustomFunctionJson, covariateJsons, derivedFieldJsons) {
    const firstVariableCovariate = json_covariate_1.findCovariateJsonWithName(covariateJsons, rcsCustomFunctionJson.firstVariableCovariate);
    if (!firstVariableCovariate) {
        throw new Error(`No first variable covariate ${rcsCustomFunctionJson.firstVariableCovariate} found`);
    }
    return new rcs_custom_function_1.RcsCustomFunction(rcsCustomFunctionJson, json_covariate_1.parseCovariateJsonToCovariate(firstVariableCovariate, covariateJsons, derivedFieldJsons));
}
exports.parseRcsCustomFunctionJsonToRcsCustomFunction = parseRcsCustomFunctionJsonToRcsCustomFunction;
//# sourceMappingURL=json-rcs-custom-function.js.map