"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const covariate_1 = require("../covariate");
function parseUserFunctions(userFunctionsJson) {
    // tslint:disable-next-line
    let userFunctions = {};
    Object.keys(userFunctionsJson).forEach(userFunctionJsonKey => {
        eval(userFunctionsJson[userFunctionJsonKey]);
    });
    return userFunctions;
}
exports.parseUserFunctions = parseUserFunctions;
function parseAlgorithmJson(coxJson) {
    const { derivedFields } = coxJson, coxJsonWithoutDerivedFields = tslib_1.__rest(coxJson, ["derivedFields"]);
    return Object.assign({}, coxJsonWithoutDerivedFields, { covariates: coxJson.covariates.map(covariateJson => {
            return covariate_1.parseCovariateJsonToCovariate(covariateJson, coxJson.covariates, derivedFields);
        }), userFunctions: parseUserFunctions(coxJson.userFunctions) });
}
exports.parseAlgorithmJson = parseAlgorithmJson;
//# sourceMappingURL=algorithm-json.js.map