"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-line-length
const cox_survival_algorithm_1 = require("../../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");
function parseCoxSurvivalAlgorithmJson(coxSurvivalAlgorithmJson) {
    return new cox_survival_algorithm_1.CoxSurvivalAlgorithm(coxSurvivalAlgorithmJson);
}
exports.parseCoxSurvivalAlgorithmJson = parseCoxSurvivalAlgorithmJson;
//# sourceMappingURL=json-cox-survival-algorithm.js.map