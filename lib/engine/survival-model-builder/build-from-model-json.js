"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const survival_model_functions_1 = require("./survival-model-functions");
function getBuildFromModelJsonFunction() {
    return {
        buildFromModelJson: modelJson => {
            const model = model_1.parseModelJsonToModel(modelJson);
            return new survival_model_functions_1.SurvivalModelFunctions(model, modelJson);
        },
    };
}
exports.getBuildFromModelJsonFunction = getBuildFromModelJsonFunction;
//# sourceMappingURL=build-from-model-json.js.map