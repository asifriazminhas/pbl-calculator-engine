"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rcs_custom_function_1 = require("./rcs-custom-function");
const custom_function_types_1 = require("../../common/custom-function-types");
function parseCustomFunctionJsonToCustomFunction(customFunctionJson, covariateJsons, derivedFieldJsons) {
    if (customFunctionJson.customFunctionType === custom_function_types_1.CustomFunctionTypes.RcsCustomFunction) {
        return rcs_custom_function_1.parseRcsCustomFunctionJsonToRcsCustomFunction(customFunctionJson, covariateJsons, derivedFieldJsons);
    }
    else {
        throw new Error(`Unknown custom function type`);
    }
}
exports.parseCustomFunctionJsonToCustomFunction = parseCustomFunctionJsonToCustomFunction;
//# sourceMappingURL=custom-function.js.map