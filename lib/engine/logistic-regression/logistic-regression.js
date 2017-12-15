"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
function getRisk(logRegAlgorithm, data) {
    const logit = regression_algorithm_1.getBaselineForData(logRegAlgorithm, data) +
        regression_algorithm_1.calculateScore(logRegAlgorithm, data);
    const elogit = Math.exp(logit);
    return elogit / (1 + elogit);
}
exports.getRisk = getRisk;
//# sourceMappingURL=logistic-regression.js.map