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
function parseBaselineFromPmmlXml(pmml) {
    return Number(pmml.pmmlXml.PMML.GeneralRegressionModel.$.baselineHazard);
}
function pmmlStringsToJson(pmmlXmlStrings) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const pmml = yield pmml_1.PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);
        const allDefineFunctionNames = pmml.pmmlXml.PMML.LocalTransformations.DefineFunction.map(defineFunction => defineFunction.$.name);
        const parsedAlgorithm = {
            algorithmType: getAlgorithmTypeFromGeneralRegressionModel(pmml.pmmlXml.PMML.GeneralRegressionModel),
            name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
            version: pmml.pmmlXml.PMML.Header.Extension.Version,
            description: pmml.pmmlXml.PMML.Header.$.description,
            baseline: parseBaselineFromPmmlXml(pmml),
            covariates: covariate_1.parseCovariates(pmml),
            derivedFields: derived_field_1.parseDerivedFields(pmml, allDefineFunctionNames),
            userFunctions: pmml.pmmlXml.PMML.LocalTransformations.DefineFunction
                .map(defineFunction => define_function_1.parseDefineFunction(defineFunction, allDefineFunctionNames))
                .reduce((userFunctionObj, currentObject) => {
                return Object.assign({}, userFunctionObj, currentObject);
            }, {}),
            // TODO Fix this
            causeDeletedRef: null,
        };
        // parseFromAlgorithmJson(parsedAlgorithm);
        return parsedAlgorithm;
    });
}
function pmmlXmlStringsToJson(modelPmmlXmlStrings, predicates) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const parsedAlgorithms = yield Promise.all(modelPmmlXmlStrings.map(pmmlXmlStrings => pmmlStringsToJson(pmmlXmlStrings)));
        if (parsedAlgorithms.length === 1) {
            return {
                modelType: model_1.ModelType.SingleAlgorithm,
                algorithm: parsedAlgorithms[0],
            };
        }
        else {
            return {
                modelType: model_1.ModelType.MultipleAlgorithm,
                algorithms: parsedAlgorithms.map((parsedAlgorithm, index) => {
                    return {
                        algorithm: parsedAlgorithm,
                        predicate: predicates[index],
                    };
                }),
            };
        }
    });
}
exports.pmmlXmlStringsToJson = pmmlXmlStringsToJson;
//# sourceMappingURL=pmml.js.map