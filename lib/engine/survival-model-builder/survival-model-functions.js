"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const cox_1 = require("../cox");
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
const calibration_1 = require("../regression-algorithm/calibration/calibration");
const predicate_1 = require("../multiple-algorithm-model/predicate/predicate");
class SurvivalModelFunctions {
    constructor(model, modelJson) {
        this.getRiskToTime = (data, time) => {
            return cox_1.getRiskToTime(this.getAlgorithmForData(data), data, time);
        };
        this.getSurvivalToTime = (data, time) => {
            return cox_1.getSurvivalToTime(this.getAlgorithmForData(data), data, time);
        };
        this.model = model;
        this.modelJson = modelJson;
    }
    getAlgorithmForData(data) {
        return model_1.getAlgorithmForModelAndData(this.model, data);
    }
    addPredictor(newPredictor) {
        if (this.model.modelType === model_1.ModelType.SingleAlgorithm) {
            return new SurvivalModelFunctions(Object.assign({}, this.model, {
                algorithm: regression_algorithm_1.addPredictor(this.model.algorithm, newPredictor),
            }), this.modelJson);
        }
        else {
            return new SurvivalModelFunctions(Object.assign({}, this.model, {
                algorithms: this.model.algorithms.map(algorithm => {
                    return Object.assign({}, algorithm, {
                        algorithms: regression_algorithm_1.addPredictor(algorithm.algorithm, newPredictor),
                    });
                }),
            }), this.modelJson);
        }
    }
    reCalibrateOutcome(calibrationJson) {
        if (this.model.modelType === model_1.ModelType.SingleAlgorithm) {
            const calibratedModel = Object.assign({}, this.model, {
                algorithm: calibration_1.addCalibrationToAlgorithm(this.model.algorithm, calibrationJson, []),
            });
            return new SurvivalModelFunctions(calibratedModel, this.modelJson);
        }
        else {
            const predicateData = [
                [{ name: 'sex', coefficent: 'male' }],
                [{ name: 'sex', coefficent: 'female' }],
            ];
            const calibratedModel = Object.assign({}, this.model, {
                algorithms: this.model.algorithms.map(({ algorithm, predicate }) => {
                    const predicateDataForCurrentPredicate = predicateData.find(currentPredicateData => {
                        return predicate_1.getPredicateResult(currentPredicateData, predicate);
                    });
                    return {
                        algorithm: calibration_1.addCalibrationToAlgorithm(algorithm, calibrationJson, predicateDataForCurrentPredicate),
                        predicate,
                    };
                }),
            });
            return new SurvivalModelFunctions(calibratedModel, this.modelJson);
        }
    }
    getModel() {
        return this.model;
    }
    getModelJson() {
        return this.modelJson;
    }
}
exports.SurvivalModelFunctions = SurvivalModelFunctions;
//# sourceMappingURL=survival-model-functions.js.map