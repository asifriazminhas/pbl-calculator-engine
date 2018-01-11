"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiple_algorithm_model_1 = require("../multiple-algorithm-model");
const model_type_1 = require("./model-type");
const algorithm_json_types_1 = require("../algorithm/algorithm-json-types");
function getAlgorithmJsonForModelAndData(model, data) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        return model.algorithm;
    }
    else {
        return multiple_algorithm_model_1.getAlgorithmJsonForData(model, data);
    }
}
exports.getAlgorithmJsonForModelAndData = getAlgorithmJsonForModelAndData;
function parseModelJsonToModel(modelTypeJson) {
    if (modelTypeJson.modelType === model_type_1.ModelType.SingleAlgorithm) {
        return Object.assign({}, modelTypeJson, {
            algorithm: algorithm_json_types_1.parseAlgorithmJson(modelTypeJson.algorithm),
        });
    }
    else {
        return Object.assign({}, modelTypeJson, {
            algorithms: modelTypeJson.algorithms.map(({ algorithm, predicate }) => {
                return {
                    algorithm: algorithm_json_types_1.parseAlgorithmJson(algorithm),
                    predicate,
                };
            }),
        });
    }
}
exports.parseModelJsonToModel = parseModelJsonToModel;
//# sourceMappingURL=json-model-types.js.map