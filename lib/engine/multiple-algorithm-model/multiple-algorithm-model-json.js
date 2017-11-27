"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicate_1 = require("./predicate");
function getAlgorithmJsonForData(multipleAlgorithmModel, data) {
    const matchedAlgorithm = multipleAlgorithmModel.algorithms.find(algorithmWithPredicate => {
        return predicate_1.getPredicateResult(data, algorithmWithPredicate.predicate);
    });
    if (!matchedAlgorithm) {
        throw new Error(`No matched algorithm found`);
    }
    return matchedAlgorithm.algorithm;
}
exports.getAlgorithmJsonForData = getAlgorithmJsonForData;
//# sourceMappingURL=multiple-algorithm-model-json.js.map