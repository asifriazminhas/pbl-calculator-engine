"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const single_algorithm_model_1 = require("../single-algorithm-model");
const multiple_algorithm_model_1 = require("../multiple-algorithm-model");
const model_type_1 = require("./model-type");
function getAlgorithmForModelAndData(model, data) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        return model.algorithm;
    }
    else {
        return multiple_algorithm_model_1.getAlgorithmForData(model, data);
    }
}
exports.getAlgorithmForModelAndData = getAlgorithmForModelAndData;
function updateBaselineForModel(model, newBaseline) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        return single_algorithm_model_1.updateBaselineForModel(model, newBaseline);
    }
    else {
        return multiple_algorithm_model_1.updateBaselineForModel(model, newBaseline);
    }
}
exports.updateBaselineForModel = updateBaselineForModel;
//# sourceMappingURL=model-types.js.map