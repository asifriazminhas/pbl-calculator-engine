"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertBetasCsvStringToPmml = convertBetasCsvStringToPmml;

var xmlBuilder = _interopRequireWildcard(require("xmlbuilder"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tslint:disable-next-line:no-var-requires
var csvParse = require('csv-parse/lib/sync');

function convertBetasCsvStringToPmml(betasAndBaselineCsvString, modelName, referenceCsvString) {
  var betasAndBaselineCsv = csvParse(betasAndBaselineCsvString, {
    columns: true
  });
  var referenceCsv = referenceCsvString ? csvParse(referenceCsvString, {
    columns: true
  }) : undefined;
  var BaselineHazardColumnName = 'H0_5YR';
  var dataFields = Object.keys(betasAndBaselineCsv[0]).filter(function (columnName) {
    return columnName !== BaselineHazardColumnName;
  });
  var pmmlXml = xmlBuilder.create('PMML');
  var dataDictionaryXmlNode = pmmlXml.ele('DataDictionary', {
    numberOfFields: dataFields.length
  });
  dataFields.forEach(function (dataField) {
    dataDictionaryXmlNode.ele('DataField', {
      name: dataField,
      optype: isDataFieldCategorical(dataField) ? 'categorical' : 'continuous',
      dataType: isDataFieldCategorical(dataField) ? 'string' : 'number'
    });
  });
  var generalRegressionXmlNode = pmmlXml.ele('GeneralRegressionModel', {
    modelType: 'CoxRegression',
    modelName: modelName,
    // tslint:disable-next-line:no-string-literal
    baselineHazard: betasAndBaselineCsv[0][BaselineHazardColumnName]
  });
  /*const miningSchemaXmlNode = generalRegressionXmlNode.ele('MiningSchema');
  dataFields.forEach(dataField => {
      miningSchemaXmlNode.ele('MiningField', {
          name: dataField,
          usageType: 'active',
      });
  });*/

  var parameterListXmlNode = generalRegressionXmlNode.ele('ParameterList');
  dataFields.forEach(function (dataField, index) {
    var referenceCsvRowFound = referenceCsv ? referenceCsv.find(function (referenceCsvRow) {
      return referenceCsvRow['Variable'] === dataField;
    }) : undefined;
    parameterListXmlNode.ele('Parameter', {
      name: getParameterNameForIndex(index),
      label: dataField,
      referencePoint: referenceCsvRowFound ? referenceCsvRowFound['Mean'] : ''
    });
  });
  var covariateListXmlNode = generalRegressionXmlNode.ele('CovariateList');
  dataFields.forEach(function (dataField) {
    covariateListXmlNode.ele('Predictor', {
      name: dataField
    });
  });
  var paramMatrixXmlNode = generalRegressionXmlNode.ele('ParamMatrix');
  dataFields.forEach(function (dataField, index) {
    paramMatrixXmlNode.ele('PCell', {
      parameterName: getParameterNameForIndex(index),
      df: '1',
      beta: betasAndBaselineCsv[0][dataField]
    });
  });
  var ppmMatrixXmlNode = generalRegressionXmlNode.ele('PPMatrix');
  dataFields.forEach(function (dataField, index) {
    ppmMatrixXmlNode.ele('PPCell', {
      value: '1',
      predictorName: dataField,
      parameterName: getParameterNameForIndex(index)
    });
  });
  return pmmlXml.toString();
}

function isDataFieldCategorical(dataFieldName) {
  return dataFieldName.indexOf('_cat') > -1;
}

function getParameterNameForIndex(index) {
  return "p".concat(index);
}
//# sourceMappingURL=betas.js.map