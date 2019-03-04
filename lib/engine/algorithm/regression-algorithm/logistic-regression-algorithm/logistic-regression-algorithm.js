"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regression_algorithm_1 = require("../regression-algorithm");
class LogsiticRegressionAlgorithm extends regression_algorithm_1.RegressionAlgorithm {
    buildDataNameReport() {
        throw new Error(this.buildDataNameReport.name + ' is not implemented');
    }
    getRisk(data) {
        return this.evaluate(data);
    }
    evaluate(data) {
        const logit = this.calculateScore(data);
        const elogit = Math.exp(logit);
        return elogit / (1 + elogit);
    }
}
exports.LogsiticRegressionAlgorithm = LogsiticRegressionAlgorithm;
//# sourceMappingURL=logistic-regression-algorithm.js.map