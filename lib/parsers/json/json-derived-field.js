"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDerivedFieldJsonWithName = findDerivedFieldJsonWithName;
exports.parseDerivedFromJsonToDerivedFrom = parseDerivedFromJsonToDerivedFrom;
exports.parseDerivedFieldJsonToDerivedField = parseDerivedFieldJsonToDerivedField;

var _derivedField = require("../../engine/data-field/derived-field/derived-field");

var _jsonCovariate = require("./json-covariate");

var _dataField = require("../../engine/data-field/data-field");

function findDerivedFieldJsonWithName(derivedFieldJsons, name) {
  return derivedFieldJsons.find(function (derivedFieldJson) {
    return derivedFieldJson.name === name;
  });
}

function parseDerivedFromJsonToDerivedFrom(derivedFromJson, derivedFieldJsons, covariatesJson) {
  return derivedFromJson.map(function (derivedFromJsonItem) {
    if (typeof derivedFromJsonItem === 'string') {
      var covariateJsonForCurrentDerivedFromItem = (0, _jsonCovariate.findCovariateJsonWithName)(covariatesJson, derivedFromJsonItem);
      var derivedFieldJsonForCurrentDerivedFromItem = findDerivedFieldJsonWithName(derivedFieldJsons, derivedFromJsonItem);

      if (covariateJsonForCurrentDerivedFromItem) {
        return (0, _jsonCovariate.parseCovariateJsonToCovariate)(covariateJsonForCurrentDerivedFromItem, covariatesJson, derivedFieldJsons);
      } else if (derivedFieldJsonForCurrentDerivedFromItem) {
        return parseDerivedFieldJsonToDerivedField(derivedFieldJsonForCurrentDerivedFromItem, derivedFieldJsons, covariatesJson);
      } else {
        /* TODO Add error message */
        throw new Error();
      }
    } else {
      return new _dataField.DataField(derivedFromJsonItem);
    }
  });
}

function parseDerivedFieldJsonToDerivedField(derivedFieldJson, derivedFieldJsons, covariateJsons) {
  return new _derivedField.DerivedField(derivedFieldJson, parseDerivedFromJsonToDerivedFrom(derivedFieldJson.derivedFrom, derivedFieldJsons, covariateJsons));
}
//# sourceMappingURL=json-derived-field.js.map