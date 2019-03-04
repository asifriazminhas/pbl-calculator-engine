"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const derived_field_1 = require("../../engine/data-field/derived-field/derived-field");
const json_covariate_1 = require("./json-covariate");
const data_field_1 = require("../../engine/data-field/data-field");
const json_covariate_2 = require("./json-covariate");
function findDerivedFieldJsonWithName(derivedFieldJsons, name) {
    return derivedFieldJsons.find(derivedFieldJson => derivedFieldJson.name === name);
}
exports.findDerivedFieldJsonWithName = findDerivedFieldJsonWithName;
function parseDerivedFromJsonToDerivedFrom(derivedFromJson, derivedFieldJsons, covariatesJson) {
    return derivedFromJson.map(derivedFromJsonItem => {
        if (typeof derivedFromJsonItem === 'string') {
            const covariateJsonForCurrentDerivedFromItem = json_covariate_2.findCovariateJsonWithName(covariatesJson, derivedFromJsonItem);
            const derivedFieldJsonForCurrentDerivedFromItem = findDerivedFieldJsonWithName(derivedFieldJsons, derivedFromJsonItem);
            if (covariateJsonForCurrentDerivedFromItem) {
                return json_covariate_1.parseCovariateJsonToCovariate(covariateJsonForCurrentDerivedFromItem, covariatesJson, derivedFieldJsons);
            }
            else if (derivedFieldJsonForCurrentDerivedFromItem) {
                return parseDerivedFieldJsonToDerivedField(derivedFieldJsonForCurrentDerivedFromItem, derivedFieldJsons, covariatesJson);
            }
            else {
                /* TODO Add error message */
                throw new Error();
            }
        }
        else {
            return new data_field_1.DataField(derivedFromJsonItem);
        }
    });
}
exports.parseDerivedFromJsonToDerivedFrom = parseDerivedFromJsonToDerivedFrom;
function parseDerivedFieldJsonToDerivedField(derivedFieldJson, derivedFieldJsons, covariateJsons) {
    return new derived_field_1.DerivedField(derivedFieldJson, parseDerivedFromJsonToDerivedFrom(derivedFieldJson.derivedFrom, derivedFieldJsons, covariateJsons));
}
exports.parseDerivedFieldJsonToDerivedField = parseDerivedFieldJsonToDerivedField;
//# sourceMappingURL=json-derived-field.js.map