"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_1 = require("../algorithm");
function getRisk(logRegAlgorithm, data) {
    const logit = algorithm_1.getBaselineForData(logRegAlgorithm, data) +
        algorithm_1.calculateScore(logRegAlgorithm, data);
    const elogit = Math.exp(logit);
    return elogit / (1 + elogit);
}
exports.getRisk = getRisk;
//# sourceMappingURL=logistic-regression.js.map