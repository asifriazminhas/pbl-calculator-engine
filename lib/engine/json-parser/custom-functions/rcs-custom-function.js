"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("../covariate");
function parseRcsCustomFunctionJsonToRcsCustomFunction(rcsCustomFunctionJson, covariateJsons, derivedFieldJsons) {
    const firstVariableCovariate = covariate_1.findCovariateJsonWithName(covariateJsons, rcsCustomFunctionJson.firstVariableCovariate);
    if (!firstVariableCovariate) {
        throw new Error(``);
    }
    return Object.assign({}, rcsCustomFunctionJson, {
        firstVariableCovariate: covariate_1.parseCovariateJsonToCovariate(firstVariableCovariate, covariateJsons, derivedFieldJsons)
    });
}
exports.parseRcsCustomFunctionJsonToRcsCustomFunction = parseRcsCustomFunctionJsonToRcsCustomFunction;
//# sourceMappingURL=rcs-custom-function.js.map