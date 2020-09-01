"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseRcsCustomFunctionJsonToRcsCustomFunction = parseRcsCustomFunctionJsonToRcsCustomFunction;

var _rcsCustomFunction = require("../../engine/data-field/covariate/custom-function/rcs-custom-function");

var _jsonCovariate = require("./json-covariate");

function parseRcsCustomFunctionJsonToRcsCustomFunction(rcsCustomFunctionJson, covariateJsons, derivedFieldJsons) {
  var firstVariableCovariate = (0, _jsonCovariate.findCovariateJsonWithName)(covariateJsons, rcsCustomFunctionJson.firstVariableCovariate);

  if (!firstVariableCovariate) {
    throw new Error("No first variable covariate ".concat(rcsCustomFunctionJson.firstVariableCovariate, " found"));
  }

  return new _rcsCustomFunction.RcsCustomFunction(rcsCustomFunctionJson, (0, _jsonCovariate.parseCovariateJsonToCovariate)(firstVariableCovariate, covariateJsons, derivedFieldJsons));
}
//# sourceMappingURL=json-rcs-custom-function.js.map