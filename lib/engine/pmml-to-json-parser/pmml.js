"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const covariate_1 = require("./data_fields/covariate");
const derived_field_1 = require("./data_fields/derived_field/derived_field");
const pmml_1 = require("../pmml");
//import { parseFromAlgorithmJson } from '../json/algorithm';
function parseBaselineHazardFromPmmlXml(pmml) {
    return Number(pmml.pmmlXml.PMML.GeneralRegressionModel.$.baselineHazard);
}
function pmmlXmlStringsToJson(pmmlXmlStrings) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const pmml = yield pmml_1.PmmlParser
            .parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);
        const parsedAlgorithm = {
            name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
            version: pmml.pmmlXml.PMML.Header.Extension.Version,
            description: pmml.pmmlXml.PMML.Header.$.description,
            baselineHazard: parseBaselineHazardFromPmmlXml(pmml),
            covariates: covariate_1.parseCovariates(pmml),
            derivedFields: derived_field_1.parseDerivedFields(pmml)
        };
        //parseFromAlgorithmJson(parsedAlgorithm);
        return parsedAlgorithm;
    });
}
exports.pmmlXmlStringsToJson = pmmlXmlStringsToJson;
//# sourceMappingURL=pmml.js.map