"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCoxSurvivalAlgorithmJson = parseCoxSurvivalAlgorithmJson;

var _coxSurvivalAlgorithm = require("../../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");

// tslint:disable-next-line:max-line-length
function parseCoxSurvivalAlgorithmJson(coxSurvivalAlgorithmJson) {
  return new _coxSurvivalAlgorithm.CoxSurvivalAlgorithm(coxSurvivalAlgorithmJson);
}
//# sourceMappingURL=json-cox-survival-algorithm.js.map