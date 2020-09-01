"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuildFromModelJsonFunction = getBuildFromModelJsonFunction;

var _survivalModelFunctions = require("./survival-model-functions");

var _model = require("../model/model");

function getBuildFromModelJsonFunction() {
  return {
    buildFromModelJson: function buildFromModelJson(modelJson) {
      var model = new _model.Model(modelJson);
      return new _survivalModelFunctions.SurvivalModelFunctions(model, modelJson);
    }
  };
}
//# sourceMappingURL=build-from-model-json.js.map