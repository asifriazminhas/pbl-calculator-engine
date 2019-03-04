"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var survival_model_functions_1 = require("./survival-model-functions");

var model_1 = require("../model/model");

function getBuildFromModelJsonFunction() {
  return {
    buildFromModelJson: function buildFromModelJson(modelJson) {
      var model = new model_1.Model(modelJson);
      return new survival_model_functions_1.SurvivalModelFunctions(model, modelJson);
    }
  };
}

exports.getBuildFromModelJsonFunction = getBuildFromModelJsonFunction;
//# sourceMappingURL=build-from-model-json.js.map