"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicate_1 = require("./predicate/predicate");
const undefined_1 = require("../undefined");
const errors_1 = require("../errors");
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
const predicate_errors_1 = require("./predicate/predicate-errors");
function getAlgorithmForData(multipleAlgorithmModel, data) {
    try {
        return predicate_1.getFirstTruePredicateObject(multipleAlgorithmModel.algorithms, data).algorithm;
    }
    catch (err) {
        if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
            throw new Error(`No matched algorithm found`);
        }
        throw err;
    }
}
exports.getAlgorithmForData = getAlgorithmForData;
function updateBaselineForModel(model, newBaselines) {
    return Object.assign({}, model, {
        algorithms: model.algorithms.map(({ predicate, algorithm }) => {
            const newBaselineForCurrentAlgorithm = undefined_1.throwErrorIfUndefined(newBaselines.find(({ predicateData }) => {
                return predicate_1.getPredicateResult(predicateData, predicate);
            }), new errors_1.NoBaselineFoundForAlgorithm(algorithm.name));
            return regression_algorithm_1.updateBaseline(algorithm, newBaselineForCurrentAlgorithm.newBaseline);
        }),
    });
}
exports.updateBaselineForModel = updateBaselineForModel;
//# sourceMappingURL=multiple-algorithm-model.js.map