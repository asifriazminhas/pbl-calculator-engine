"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCovariates = parseCovariates;

var _custom_function = require("./custom_functions/custom_function");

var _dataFieldType = require("../../../parsers/json/data-field-type");

var _data_field = require("./data_field");

var _extensions = require("../extensions");

var _undefined = require("../../../util/undefined");

var _errors = require("../errors");

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
    return _dataFieldType.DataFieldType.InteractionCovariate;
  } else {
    return _dataFieldType.DataFieldType.NonInteractionCovariate;
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
  return Object.assign({}, (0, _data_field.parseDataFieldFromDataFieldPmmlNode)(dataField, miningField), {
    dataFieldType: getCovariateType(predictor.$.name),
    name: predictor.$.name,
    beta: Number(pCell.$.beta),
    referencePoint: Number(parameter.$.referencePoint),
    customFunction: customFunctionJson,
    extensions: (0, _extensions.parseExtensions)(dataField),
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
    var dataFieldForCurrentPredictor = (0, _undefined.throwErrorIfUndefined)(pmml.findDataFieldWithName(predictor.$.name), (0, _errors.NoDataFieldNodeFound)(predictor.$.name)); //Paramter whose label field is the same as the predictor's name field. Problem if we don't find one. Need it for the referencePoint

    var parameterForCurrentPredictor = (0, _undefined.throwErrorIfUndefined)(pmml.findParameterWithLabel(predictor.$.name), (0, _errors.NoParameterNodeFoundWithLabel)(predictor.$.name)); //PCell whose parameterName field is the same as the predictor's name field. Problem if we dont find one. Need it for the beta

    var pCellForCurrentParamater = (0, _undefined.throwErrorIfUndefined)(pmml.findPCellWithParameterName(parameterForCurrentPredictor.$.name), (0, _errors.NoPCellNodeFoundWithParameterName)(parameterForCurrentPredictor.$.name)); //Using the DataField, Parameter, Predictor, PCell get the CovariateJson

    return parseCovariateFromPredictor(predictor, dataFieldForCurrentPredictor, parameterForCurrentPredictor, pCellForCurrentParamater, pmml.pmmlXml.PMML.MiningSchema.MiningField ? pmml.pmmlXml.PMML.MiningSchema.MiningField.find(function (miningField) {
      return miningField.$.name === predictor.$.name;
    }) : undefined, pmml.pmmlXml.PMML.CustomPMML ? (0, _custom_function.parseCustomFunction)(parameterForCurrentPredictor, pmml.pmmlXml.PMML.CustomPMML.RestrictedCubicSpline) : undefined);
  });
}
//# sourceMappingURL=covariate.js.map