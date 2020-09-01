"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findCovariateJsonWithName = findCovariateJsonWithName;
exports.parseCovariateJsonToCovariate = parseCovariateJsonToCovariate;

var _jsonRcsCustomFunction = require("./json-rcs-custom-function");

var _jsonDerivedField = require("./json-derived-field");

var _dataFieldType = require("./data-field-type");

var _interactionCovariate = require("../../engine/data-field/covariate/interaction-covariate/interaction-covariate");

var _nonInteractionCovariate = require("../../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate");

/* tslint:disable-next-line */
function findCovariateJsonWithName(covariateJsons, name) {
  return covariateJsons.find(function (covariateJson) {
    return covariateJson.name === name;
  });
}

function parseCovariateJsonToCovariate(covariateJson, covariateJsons, derivedFieldJsons) {
  var derivedFieldJsonForCovariateJson = (0, _jsonDerivedField.findDerivedFieldJsonWithName)(derivedFieldJsons, covariateJson.name);
  var parsedDerivedField = derivedFieldJsonForCovariateJson ? (0, _jsonDerivedField.parseDerivedFieldJsonToDerivedField)(derivedFieldJsonForCovariateJson, derivedFieldJsons, covariateJsons) : undefined;
  var parsedCustomFunction = covariateJson.customFunction ? (0, _jsonRcsCustomFunction.parseRcsCustomFunctionJsonToRcsCustomFunction)(covariateJson.customFunction, covariateJsons, derivedFieldJsons) : undefined;

  if (covariateJson.dataFieldType === _dataFieldType.DataFieldType.InteractionCovariate) {
    if (!parsedDerivedField) {
      throw new Error("No derived field found for interaction covariate ".concat(covariateJson.name));
    } else {
      return new _interactionCovariate.InteractionCovariate(covariateJson, parsedCustomFunction, parsedDerivedField);
    }
  } else {
    return new _nonInteractionCovariate.NonInteractionCovariate(covariateJson, parsedCustomFunction, parsedDerivedField);
  }
}
//# sourceMappingURL=json-covariate.js.map