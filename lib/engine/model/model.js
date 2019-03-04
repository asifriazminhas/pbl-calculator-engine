"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicate_1 = require("../predicate/predicate");
const model_algorithm_1 = require("./model-algorithm");
const cox_survival_algorithm_1 = require("../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");
const undefined_1 = require("../../util/undefined");
const errors_1 = require("../errors");
const predicate_errors_1 = require("../predicate/predicate-errors");
class Model {
    constructor(modelJson) {
        this.name = modelJson.name;
        this.algorithms = modelJson.algorithms.map(({ algorithm, predicate }) => {
            return new model_algorithm_1.ModelAlgorithm(new cox_survival_algorithm_1.CoxSurvivalAlgorithm(algorithm), new predicate_1.Predicate(predicate.equation, predicate.variables));
        });
    }
    getAlgorithmForData(data) {
        try {
            return predicate_1.Predicate.getFirstTruePredicateObject(this.algorithms, data)
                .algorithm;
        }
        catch (err) {
            if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
                throw new Error(`No matched algorithm found`);
            }
            throw err;
        }
    }
    updateBaselineForModel(newBaselines) {
        return Object.setPrototypeOf(Object.assign({}, this, {
            algorithms: this.algorithms.map(({ predicate, algorithm }) => {
                const newBaselineForCurrentAlgorithm = undefined_1.throwErrorIfUndefined(newBaselines.find(({ predicateData }) => {
                    return predicate.getPredicateResult(predicateData);
                }), new errors_1.NoBaselineFoundForAlgorithm(algorithm.name));
                return algorithm.updateBaseline(newBaselineForCurrentAlgorithm.newBaseline);
            }),
        }), Model.prototype);
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map