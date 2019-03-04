"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var json_rcs_custom_function_1 = require("./json-rcs-custom-function");

var json_derived_field_1 = require("./json-derived-field");

var data_field_type_1 = require("./data-field-type");

var interaction_covariate_1 = require("../../engine/data-field/covariate/interaction-covariate/interaction-covariate");
/* tslint:disable-next-line */


var non_interaction_covariate_1 = require("../../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate");

function findCovariateJsonWithName(covariateJsons, name) {
  return covariateJsons.find(function (covariateJson) {
    return covariateJson.name === name;
  });
}

exports.findCovariateJsonWithName = findCovariateJsonWithName;

function parseCovariateJsonToCovariate(covariateJson, covariateJsons, derivedFieldJsons) {
  var derivedFieldJsonForCovariateJson = json_derived_field_1.findDerivedFieldJsonWithName(derivedFieldJsons, covariateJson.name);
  var parsedDerivedField = derivedFieldJsonForCovariateJson ? json_derived_field_1.parseDerivedFieldJsonToDerivedField(derivedFieldJsonForCovariateJson, derivedFieldJsons, covariateJsons) : undefined;
  var parsedCustomFunction = covariateJson.customFunction ? json_rcs_custom_function_1.parseRcsCustomFunctionJsonToRcsCustomFunction(covariateJson.customFunction, covariateJsons, derivedFieldJsons) : undefined;

  if (covariateJson.dataFieldType === data_field_type_1.DataFieldType.InteractionCovariate) {
    if (!parsedDerivedField) {
      throw new Error("No derived field found for interaction covariate ".concat(covariateJson.name));
    } else {
      return new interaction_covariate_1.InteractionCovariate(covariateJson, parsedCustomFunction, parsedDerivedField);
    }
  } else {
    return new non_interaction_covariate_1.NonInteractionCovariate(covariateJson, parsedCustomFunction, parsedDerivedField);
  }
}

exports.parseCovariateJsonToCovariate = parseCovariateJsonToCovariate;
//# sourceMappingURL=json-covariate.js.map