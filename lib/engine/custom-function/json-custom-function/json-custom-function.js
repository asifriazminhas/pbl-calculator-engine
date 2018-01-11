"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_rcs_custom_function_1 = require("./json-rcs-custom-function");
const custom_function_1 = require("../../custom-function");
function parseCustomFunctionJsonToCustomFunction(customFunctionJson, covariateJsons, derivedFieldJsons) {
    if (customFunctionJson.customFunctionType ===
        custom_function_1.CustomFunctionType.RcsCustomFunction) {
        return json_rcs_custom_function_1.parseRcsCustomFunctionJsonToRcsCustomFunction(customFunctionJson, covariateJsons, derivedFieldJsons);
    }
    else {
        throw new Error(`Unknown custom function type`);
    }
}
exports.parseCustomFunctionJsonToCustomFunction = parseCustomFunctionJsonToCustomFunction;
//# sourceMappingURL=json-custom-function.js.map