"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regression_algorithm_json_types_1 = require("../regression-algorithm/regression-algorithm-json-types");
const simple_algorithm_1 = require("../simple-algorithm");
function parseAlgorithmJson(algorithmJson) {
    if (regression_algorithm_json_types_1.isRegressionAlgorithmJson(algorithmJson)) {
        return regression_algorithm_json_types_1.parseRegressionAlgorithmJson(algorithmJson);
    }
    else {
        return simple_algorithm_1.parseSimpleAlgorithmJsonToSimpleAlgorithm(algorithmJson);
    }
}
exports.parseAlgorithmJson = parseAlgorithmJson;
//# sourceMappingURL=algorithm-json-types.js.map