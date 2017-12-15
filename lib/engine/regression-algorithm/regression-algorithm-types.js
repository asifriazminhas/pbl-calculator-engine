"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_type_1 = require("../algorithm/algorithm-type");
function isRegressionAlgorithm(algorithm) {
    return (algorithm.algorithmType === algorithm_type_1.AlgorithmType.Cox ||
        algorithm.algorithmType === algorithm_type_1.AlgorithmType.LogisticRegression);
}
exports.isRegressionAlgorithm = isRegressionAlgorithm;
//# sourceMappingURL=regression-algorithm-types.js.map