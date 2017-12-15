"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const cox_1 = require("../cox");
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
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
    reCalibrateOutcome(calibrationObjects) {
        if (calibrationObjects instanceof Array) {
            return new SurvivalModelFunctions(model_1.updateBaselineForModel(this.model, this.convertCalibrationObjectsToBaselineObject(calibrationObjects)), this.modelJson);
        }
        else {
            return new SurvivalModelFunctions(model_1.updateBaselineForModel(this.model, [
                {
                    predicateData: [
                        {
                            name: 'sex',
                            coefficent: 'male',
                        },
                    ],
                    newBaseline: this.convertCalibrationObjectsToBaselineObject(calibrationObjects.male),
                },
                {
                    predicateData: [
                        {
                            name: 'sex',
                            coefficent: 'female',
                        },
                    ],
                    newBaseline: this.convertCalibrationObjectsToBaselineObject(calibrationObjects.female),
                },
            ]), this.modelJson);
        }
    }
    getModel() {
        return this.model;
    }
    getModelJson() {
        return this.modelJson;
    }
    convertCalibrationObjectsToBaselineObject(calibrationObjects) {
        return calibrationObjects.reduce((baselineObject, currentCalibrationObject) => {
            return Object.assign({}, baselineObject, {
                [currentCalibrationObject.age]: currentCalibrationObject.baseline,
            });
        }, {});
    }
}
exports.SurvivalModelFunctions = SurvivalModelFunctions;
//# sourceMappingURL=survival-model-functions.js.map