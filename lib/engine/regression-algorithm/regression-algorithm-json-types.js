"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../covariate/index");
const algorithm_json_1 = require("../algorithm/algorithm-json");
const algorithm_type_1 = require("../algorithm/algorithm-type");
function parseRegressionAlgorithmJson(regressionAlgorithmJson) {
    const { derivedFields } = regressionAlgorithmJson, coxJsonWithoutDerivedFields = tslib_1.__rest(regressionAlgorithmJson, ["derivedFields"]);
    return Object.assign({}, coxJsonWithoutDerivedFields, { covariates: regressionAlgorithmJson.covariates.map(covariateJson => {
            return index_1.parseCovariateJsonToCovariate(covariateJson, regressionAlgorithmJson.covariates, derivedFields);
        }), userFunctions: algorithm_json_1.parseUserFunctions(regressionAlgorithmJson.userFunctions) });
}
exports.parseRegressionAlgorithmJson = parseRegressionAlgorithmJson;
function isRegressionAlgorithmJson(algorithm) {
    return (algorithm.algorithmType === algorithm_type_1.AlgorithmType.Cox ||
        algorithm.algorithmType === algorithm_type_1.AlgorithmType.LogisticRegression);
}
exports.isRegressionAlgorithmJson = isRegressionAlgorithmJson;
//# sourceMappingURL=regression-algorithm-json-types.js.map