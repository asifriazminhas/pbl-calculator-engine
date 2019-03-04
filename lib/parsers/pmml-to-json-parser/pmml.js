"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("./data_fields/covariate");
const derived_field_1 = require("./data_fields/derived_field/derived_field");
const pmml_1 = require("../pmml");
const define_function_1 = require("./define-function/define-function");
const taxonomy_1 = require("./taxonomy");
const optimizations_1 = require("./optimizations");
const undefined_1 = require("../../util/undefined/undefined");
const time_metric_1 = require("../../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric");
function parseBaselineFromPmmlXml(generalRegressionModel) {
    return Number(generalRegressionModel.$.baselineHazard);
}
async function pmmlStringsToJson(pmmlXmlStrings) {
    const pmml = await pmml_1.PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);
    const allDefineFunctionNames = undefined_1.returnEmptyArrayIfUndefined(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction).map(defineFunction => defineFunction.$.name);
    const generalRegressionModel = pmml.pmmlXml.PMML
        .GeneralRegressionModel;
    const baseAlgorithm = {
        name: pmml.pmmlXml.PMML.Header.Extension.value,
        derivedFields: derived_field_1.parseDerivedFields(pmml, allDefineFunctionNames),
        userFunctions: undefined_1.returnEmptyArrayIfUndefined(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction)
            .map(defineFunction => define_function_1.parseDefineFunction(defineFunction, allDefineFunctionNames))
            .reduce((userFunctionObj, currentObject) => {
            return Object.assign({}, userFunctionObj, currentObject);
        }, {}),
        tables: taxonomy_1.parseTaxonomy(pmml.pmmlXml.PMML.Taxonomy),
        baseline: parseBaselineFromPmmlXml(generalRegressionModel),
        covariates: covariate_1.parseCovariates(pmml),
        timeMetric: parseTimeMetric(generalRegressionModel),
        maximumTime: Number(generalRegressionModel.Extension.find(extension => {
            return extension.name === 'maximumTime';
        }).value),
    };
    return baseAlgorithm;
}
async function pmmlXmlStringsToJson(modelPmmlXmlStrings, predicates) {
    const parsedAlgorithms = await Promise.all(modelPmmlXmlStrings.map(pmmlXmlStrings => pmmlStringsToJson(pmmlXmlStrings)));
    const modelJson = {
        name: '',
        algorithms: parsedAlgorithms.map((currentParsedAlgorithm, index) => {
            return {
                algorithm: currentParsedAlgorithm,
                predicate: predicates[index],
            };
        }),
    };
    return optimizations_1.optimizeModel(modelJson);
}
exports.pmmlXmlStringsToJson = pmmlXmlStringsToJson;
function parseTimeMetric(generalRegressionModel) {
    const pmmlTimeMetric = generalRegressionModel.Extension.find(({ name }) => {
        return name === 'timeMetric';
    }).value;
    switch (pmmlTimeMetric) {
        case 'days': {
            return time_metric_1.TimeMetric.Days;
        }
        case 'years': {
            return time_metric_1.TimeMetric.Years;
        }
        default: {
            throw new Error(`Unknown time metric extension value ${pmmlTimeMetric}`);
        }
    }
}
//# sourceMappingURL=pmml.js.map