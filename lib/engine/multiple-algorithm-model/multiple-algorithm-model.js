"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicate_1 = require("./predicate");
const undefined_1 = require("../undefined");
const errors_1 = require("../errors");
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
function getAlgorithmForData(multipleAlgorithmModel, data) {
    const matchedAlgorithm = multipleAlgorithmModel.algorithms.find(algorithmWithPredicate => {
        return predicate_1.getPredicateResult(data, algorithmWithPredicate.predicate);
    });
    if (!matchedAlgorithm) {
        throw new Error(`No matched algorithm found`);
    }
    return matchedAlgorithm.algorithm;
}
exports.getAlgorithmForData = getAlgorithmForData;
function updateBaselineForModel(model, newBaselines) {
    return Object.assign({}, model, {
        algorithms: model.algorithms.map(({ predicate, algorithm }) => {
            const newBaselineForCurrentAlgorithm = undefined_1.throwErrorIfUndefined(newBaselines.find(({ predicateData }) => {
                return predicate_1.getPredicateResult(predicateData, predicate);
            }), new errors_1.NoBaselineFoundForAlgorithm(algorithm.name));
            return regression_algorithm_1.updateBaseline(algorithm, newBaselineForCurrentAlgorithm);
        }),
    });
}
exports.updateBaselineForModel = updateBaselineForModel;
//# sourceMappingURL=multiple-algorithm-model.js.map