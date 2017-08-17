"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("./covariate");
function findDerivedFieldJsonWithName(derivedFieldJsons, name) {
    return derivedFieldJsons
        .find(derivedFieldJson => derivedFieldJson.name === name);
}
exports.findDerivedFieldJsonWithName = findDerivedFieldJsonWithName;
function parseDerivedFromJsonToDerivedFrom(derivedFromJson, derivedFieldJsons, covariatesJson) {
    return derivedFromJson
        .map((derivedFromJsonItem) => {
        if (typeof derivedFromJsonItem === 'string') {
            const covariateJsonForCurrentDerivedFromItem = covariate_1.findCovariateJsonWithName(covariatesJson, derivedFromJsonItem);
            const derivedFieldJsonForCurrentDerivedFromItem = findDerivedFieldJsonWithName(derivedFieldJsons, derivedFromJsonItem);
            if (covariateJsonForCurrentDerivedFromItem) {
                return covariate_1.parseCovariateJsonToCovariate(covariateJsonForCurrentDerivedFromItem, covariatesJson, derivedFieldJsons);
            }
            else if (derivedFieldJsonForCurrentDerivedFromItem) {
                return parseDerivedFieldJsonToDerivedField(derivedFieldJsonForCurrentDerivedFromItem, derivedFieldJsons, covariatesJson);
            }
            else {
                throw new Error();
            }
        }
        else {
            return derivedFromJsonItem;
        }
    });
}
exports.parseDerivedFromJsonToDerivedFrom = parseDerivedFromJsonToDerivedFrom;
function parseDerivedFieldJsonToDerivedField(derivedFieldJson, derivedFieldJsons, covariateJsons) {
    return Object.assign({}, derivedFieldJson, {
        derivedFrom: parseDerivedFromJsonToDerivedFrom(derivedFieldJson.derivedFrom, derivedFieldJsons, covariateJsons)
    });
}
exports.parseDerivedFieldJsonToDerivedField = parseDerivedFieldJsonToDerivedField;
//# sourceMappingURL=derived-field.js.map