"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const covariate_1 = require("./data_fields/covariate");
const derived_field_1 = require("./data_fields/derived_field/derived_field");
const pmml_1 = require("../pmml");
const define_function_1 = require("./define-function/define-function");
const model_1 = require("../model");
const algorithm_1 = require("../algorithm");
const errors_1 = require("../errors");
const taxonomy_1 = require("./taxonomy");
const optimizations_1 = require("./optimizations");
const undefined_1 = require("../undefined/undefined");
function getAlgorithmTypeFromGeneralRegressionModel(generalRegressionModel) {
    switch (generalRegressionModel.$.modelType) {
        case pmml_1.CoxRegressionModelType: {
            return algorithm_1.AlgorithmType.Cox;
        }
        case pmml_1.LogisticRegressionModelType: {
            return algorithm_1.AlgorithmType.LogisticRegression;
        }
        default: {
            throw new errors_1.UnknownRegressionType(generalRegressionModel.$.modelType);
        }
    }
}
function getOutputName(output) {
    return output.OutputField.$.name;
}
function parseBaselineFromPmmlXml(generalRegressionModel) {
    return Number(generalRegressionModel.$.baselineHazard);
}
function pmmlStringsToJson(pmmlXmlStrings) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const pmml = yield pmml_1.PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);
        const allDefineFunctionNames = undefined_1.returnEmptyArrayIfUndefined(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction).map(defineFunction => defineFunction.$.name);
        const baseAlgorithm = {
            algorithmType: algorithm_1.AlgorithmType.Unknown,
            name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
            version: pmml.pmmlXml.PMML.Header.Extension.Version,
            description: pmml.pmmlXml.PMML.Header.$.description,
            derivedFields: derived_field_1.parseDerivedFields(pmml, allDefineFunctionNames),
            userFunctions: undefined_1.returnEmptyArrayIfUndefined(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction)
                .map(defineFunction => define_function_1.parseDefineFunction(defineFunction, allDefineFunctionNames))
                .reduce((userFunctionObj, currentObject) => {
                return Object.assign({}, userFunctionObj, currentObject);
            }, {}),
            tables: taxonomy_1.parseTaxonomy(pmml.pmmlXml.PMML.Taxonomy),
        };
        if (pmml.pmmlXml.PMML.GeneralRegressionModel) {
            return Object.assign({}, baseAlgorithm, { algorithmType: getAlgorithmTypeFromGeneralRegressionModel(pmml.pmmlXml.PMML.GeneralRegressionModel), baseline: parseBaselineFromPmmlXml(pmml.pmmlXml.PMML.GeneralRegressionModel), covariates: covariate_1.parseCovariates(pmml) });
        }
        else if (pmml.pmmlXml.PMML.Output && pmml.pmmlXml.PMML.Targets) {
            return Object.assign({}, baseAlgorithm, {
                algorithmType: algorithm_1.AlgorithmType.SimpleAlgorithm,
                output: getOutputName(pmml.pmmlXml.PMML.Output),
            });
        }
        else {
            throw new Error(`Unknown algorithm`);
        }
    });
}
function pmmlXmlStringsToJson(modelPmmlXmlStrings, predicates) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const parsedAlgorithms = yield Promise.all(modelPmmlXmlStrings.map(pmmlXmlStrings => pmmlStringsToJson(pmmlXmlStrings)));
        const modelJson = parsedAlgorithms.length === 1
            ? {
                modelType: model_1.ModelType.SingleAlgorithm,
                algorithm: parsedAlgorithms[0],
            }
            : {
                modelType: model_1.ModelType.MultipleAlgorithm,
                algorithms: parsedAlgorithms.map((parsedAlgorithm, index) => {
                    return {
                        algorithm: parsedAlgorithm,
                        predicate: predicates[index],
                    };
                }),
            };
        return optimizations_1.optimizeModel(modelJson);
    });
}
exports.pmmlXmlStringsToJson = pmmlXmlStringsToJson;
//# sourceMappingURL=pmml.js.map