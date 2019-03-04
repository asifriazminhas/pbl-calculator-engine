"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var custom_function_1 = require("./custom_functions/custom_function");

var data_field_type_1 = require("../../../parsers/json/data-field-type");

var data_field_1 = require("./data_field");

var extensions_1 = require("../extensions");

var undefined_1 = require("../../../util/undefined");

var errors_1 = require("../errors");
/**
 *
 * @param {string} name
 * @returns {boolean}
 */


function isCovariateWithNameAnInteractionCovariate(covariateName) {
  return covariateName.indexOf('_int') > -1;
}
/**
 * Returns a string representing the type of covariate. Covariate types are:
 * Interaction
 *
 * @param {string} name
 * @returns {string}
 */


function getCovariateType(name) {
  if (isCovariateWithNameAnInteractionCovariate(name)) {
    return data_field_type_1.DataFieldType.InteractionCovariate;
  } else {
    return data_field_type_1.DataFieldType.NonInteractionCovariate;
  }
}
/**
 * Returns the covariate json object for the passed predictor arg
 *
 * @param {Predictor} predictor
 * @param {DataField} dataField DataField node whose name field matches with the predictor's name field
 * @param {Parameter} parameter Parameter node whose label field matches with the predictor's name field
 * @param {PCell} pCell PCell node whose parameterName field matches with the parameter's name field
 * @param {(IRcsCustomFunctionJson | null)} customFunctionJson The custom function is any for this covariate
 * @returns {CovariateJson}
 */


function parseCovariateFromPredictor(predictor, dataField, parameter, pCell, miningField, customFunctionJson) {
  return Object.assign({}, data_field_1.parseDataFieldFromDataFieldPmmlNode(dataField, miningField), {
    dataFieldType: getCovariateType(predictor.$.name),
    name: predictor.$.name,
    beta: Number(pCell.$.beta),
    referencePoint: Number(parameter.$.referencePoint),
    customFunction: customFunctionJson,
    extensions: extensions_1.parseExtensions(dataField),
    groups: []
  });
}
/**
 * Returns all the JSON covariate objects in the pmml argument
 *
 * @export
 * @param {CustomPmmlXml} pmml
 * @returns {Array<CovariateJson>}
 */


function parseCovariates(pmml) {
  //Each Predictor Node in the CovariateList node is a covariate
  return pmml.pmmlXml.PMML.GeneralRegressionModel.CovariateList.Predictor.map(function (predictor) {
    //DataField whose name field is the same as the predictor's name field. Problem if we don't find one. Need it for the following fields: name, displayName, opType, recommended extension anf question extension
    var dataFieldForCurrentPredictor = undefined_1.throwErrorIfUndefined(pmml.findDataFieldWithName(predictor.$.name), errors_1.NoDataFieldNodeFound(predictor.$.name)); //Paramter whose label field is the same as the predictor's name field. Problem if we don't find one. Need it for the referencePoint

    var parameterForCurrentPredictor = undefined_1.throwErrorIfUndefined(pmml.findParameterWithLabel(predictor.$.name), errors_1.NoParameterNodeFoundWithLabel(predictor.$.name)); //PCell whose parameterName field is the same as the predictor's name field. Problem if we dont find one. Need it for the beta

    var pCellForCurrentParamater = undefined_1.throwErrorIfUndefined(pmml.findPCellWithParameterName(parameterForCurrentPredictor.$.name), errors_1.NoPCellNodeFoundWithParameterName(parameterForCurrentPredictor.$.name)); //Using the DataField, Parameter, Predictor, PCell get the CovariateJson

    return parseCovariateFromPredictor(predictor, dataFieldForCurrentPredictor, parameterForCurrentPredictor, pCellForCurrentParamater, pmml.pmmlXml.PMML.MiningSchema.MiningField ? pmml.pmmlXml.PMML.MiningSchema.MiningField.find(function (miningField) {
      return miningField.$.name === predictor.$.name;
    }) : undefined, custom_function_1.parseCustomFunction(parameterForCurrentPredictor, pmml.pmmlXml.PMML.CustomPMML.RestrictedCubicSpline));
  });
}

exports.parseCovariates = parseCovariates;
//# sourceMappingURL=covariate.js.map