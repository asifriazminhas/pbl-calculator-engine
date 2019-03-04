"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:disable-next-line

var csvParse = require('csv-parse/lib/sync');

var xmlBuilder = require("xmlbuilder");

var undefined_1 = require("../../../util/undefined");

exports.SupplementaryUsageType = 'supplementary';
exports.ActiveUsageType = 'active';
/**
 * Parses the type of variable from the PHIAT csv VariableType column
 *
 * @param {VariableType} variableType
 * @returns
 */

function parseVariableType(variableType) {
  if (variableType === 'continuous') {
    return 'continuous';
  } else if (variableType === 'categorical') {
    return 'categorical';
  } else {
    throw new Error("Unknown variable type ".concat(variableType));
  }
}
/* Adds a DerivedField node to the localTransformationsNode which represents
the field which has the mean value for the data field with the name in the name arg */


function addMeanDerivedField(localTransformationsNode, name) {
  return localTransformationsNode.ele('DerivedField', {
    name: "".concat(name, "_mean"),
    dataType: 'double',
    optype: 'continuous'
  });
}

function parseCategoriesFromWebSpecificationsCsv(webSpecificationsCategoriesCsv) {
  var categories = [];
  webSpecificationsCategoriesCsv.forEach(function (webSpecificationsCategoriesCsvRow) {
    if (webSpecificationsCategoriesCsvRow['Variable Name'] !== '') {
      categories.push({
        name: webSpecificationsCategoriesCsvRow['Variable Name'],
        categories: []
      });
    }

    categories[categories.length - 1].categories.push({
      value: webSpecificationsCategoriesCsvRow['Category Value'],
      displayName: webSpecificationsCategoriesCsvRow['Category Label'],
      description: webSpecificationsCategoriesCsvRow['Category Description']
    });
  });
  return categories;
}

function addHeaderNode(pmmlNode) {
  pmmlNode.ele('Header', {
    description: ''
  }).ele('Extension', {
    ModelName: 'Unknown',
    Version: 'Unknown'
  });
}

function addGeneralRegressionModelNode(pmmlNode, webSpecificationsCsv, baselineHazard, outputName, modelType) {
  var generalRegressionModelNode = pmmlNode.ele('GeneralRegressionModel', {
    baselineHazard: baselineHazard,
    modelType: modelType
  });
  var parameterListNode = generalRegressionModelNode.ele('ParameterList');
  var covariateListNode = generalRegressionModelNode.ele('CovariateList');
  var paramMatrixNode = generalRegressionModelNode.ele('ParamMatrix');
  var MiningFieldNodeName = 'MiningField';
  var miningSchemaNode = generalRegressionModelNode.ele('MiningSchema');
  miningSchemaNode.ele(MiningFieldNodeName, {
    name: outputName,
    usageType: 'predicted'
  });
  var covariateCsvRows = webSpecificationsCsv.filter(function (webSpecificationsCsvRow) {
    return webSpecificationsCsvRow.usageType === exports.ActiveUsageType;
  });
  covariateCsvRows.forEach(function (covariateCsvRow, index) {
    var parameterName = "p".concat(index);
    parameterListNode.ele('Parameter', {
      name: parameterName,
      label: covariateCsvRow.Name,
      referencePoint: ''
    });
    miningSchemaNode.ele('MiningField', {
      name: covariateCsvRow.Name,
      usageType: 'active'
    });
    covariateListNode.ele('Predictor', {
      name: covariateCsvRow.Name
    });
    paramMatrixNode.ele('PCell', {
      parameterName: parameterName,
      beta: covariateCsvRow.betacoefficent
    });
  });
  var customPmmlEle = pmmlNode.ele('CustomPMML', {});
  var rcsObjs = covariateCsvRows.reduce(function (currentRcsObjs, covariateCsvRow, index) {
    if (covariateCsvRow.Name.indexOf('rcs') > -1 && covariateCsvRow.Name.split('rcs')[1].split('_')[1] !== '1') {
      var rcsObjForCurrentRow = currentRcsObjs.find(function (rcsObj) {
        return rcsObj.rcsVariableName === covariateCsvRow.Name.split('rcs')[0];
      });

      if (!rcsObjForCurrentRow) {
        currentRcsObjs.push({
          rcsVariableName: covariateCsvRow.Name.split('rcs')[0],
          parameterNames: ["p".concat(index)],
          knotLocations: covariateCsvRow.knots.split(',').map(Number)
        });
      } else {
        rcsObjForCurrentRow.parameterNames.push("p".concat(index));
      }
    }

    return currentRcsObjs;
  }, []);
  var restrictedCubicSplineEle = customPmmlEle.ele('RestrictedCubicSpline', {});
  rcsObjs.forEach(function (rcsObj) {
    restrictedCubicSplineEle.ele('PCell', {
      parameterName: rcsObj.parameterNames.join(', '),
      knotLocations: rcsObj.knotLocations.join(', ')
    });
  });
}

function transformPhiatDictionaryToPmml(algorithmName, phiatCsvString, webSpecificationsCategories, algorithmInfo, gender, addMeans, addBetas) {
  // Parse the csv string into array of objects
  var originalPhiatCsv = csvParse(phiatCsvString, {
    columns: true
  });
  var phiatCsv = originalPhiatCsv.filter(function (phiatCsvRow) {
    return phiatCsvRow.Tool === algorithmName;
  });

  if (phiatCsv.length === 0) {
    throw new Error("No rows found in web specifications csv for algorithm ".concat(algorithmName));
  }

  var webSpecificationsCategoriesCsv = csvParse(webSpecificationsCategories, {
    columns: true
  });
  var webSpecificationCategories = parseCategoriesFromWebSpecificationsCsv(webSpecificationsCategoriesCsv);
  var phiatRowsNamesToFilterOut = ['SurveyCycle2', 'SurveyCycle3', 'SurveyCycle4'];
  var phiatCsvRowsWithoutReference = phiatCsv // Remove all rows which are Reference variableType
  .filter(function (phiatCsvRow) {
    return phiatCsvRow.variableUse !== 'Reference';
  }) // Remove all rows whose Name field matches any in the array phiatRowsNamesToFilterOut
  .filter(function (PhiatCsvRow) {
    return phiatRowsNamesToFilterOut.indexOf(PhiatCsvRow.Name) === -1;
  }) // Trim the VariableName and Sex fields
  .map(function (phiatCsvRow) {
    return Object.assign({}, phiatCsvRow, {
      VariableName: phiatCsvRow.Name.trim(),
      Sex: phiatCsvRow.Sex.trim()
    });
  });
  var dataFields = phiatCsvRowsWithoutReference.reduce(function (currentDataFields, phiatCsvRow) {
    // Find a parsed data field with the same name as the current phiatCsvRow
    var dataFieldForCurrentPhiatCsvRow = Object.keys(currentDataFields).find(function (dataFieldName) {
      return dataFieldName === phiatCsvRow.Name;
    }); // If we did not find one

    if (!dataFieldForCurrentPhiatCsvRow) {
      // Parse the current PHIAT csv row and add it to the object of parsed data fields
      currentDataFields[phiatCsvRow.Name] = Object.assign({}, phiatCsvRow, {
        Mean: {
          // if the current row is male
          Male: phiatCsvRow.Sex === 'Male' ? Number(phiatCsvRow.Mean) : null,
          // if the current row is female
          Female: phiatCsvRow.Sex === 'Female' ? Number(phiatCsvRow.Mean) : null
        }
      });
    } else {
      // Otherwise update the found parsed data field mean field
      currentDataFields[phiatCsvRow.Name].Mean[phiatCsvRow.Sex] = Number(phiatCsvRow.Mean);
    }

    return currentDataFields;
  }, {}); // Create root PMML node

  var pmmlXml = xmlBuilder.create('PMML');
  addHeaderNode(pmmlXml);

  if (addBetas) {
    addGeneralRegressionModelNode(pmmlXml, phiatCsvRowsWithoutReference, Number(algorithmInfo.BaselineHazard), 'unknown', algorithmInfo.RegressionType);
  }

  var localTransformationsNode = pmmlXml.ele('LocalTransformations'); // If we should add the transformations for the means to the output PMML file

  if (addMeans) {
    // Add the DerivedFields for the means
    Object.keys(dataFields).forEach(function (dataField) {
      // if this data field is not for both genders
      if (gender !== 'both') {
        // Check if the Mean has been set for the gender it is for
        if (dataFields[dataField].Mean[gender]) {
          // Add the DerivedField node for the mean transformations
          var derivedField = addMeanDerivedField(localTransformationsNode, dataField.trim()); // Add a Constant which has the number mean value

          derivedField.ele('Constant', {
            dataType: 'double'
          }, dataFields[dataField].Mean[gender]);
        }
      } else {
        // Otherwise this DataField has means for both genders
        // Add DerivedField node
        var _derivedField = addMeanDerivedField(localTransformationsNode, dataField.trim());
        /* Add nodes which check if the current evaluation of the
        algorithm is for a male or female person and set the mean field
        to the right mean value depending on that value. The sex
        variable is Sex */


        var applyIfNode = _derivedField.ele('Apply', {
          function: 'if'
        });

        var applyEqualNode = applyIfNode.ele('Apply', {
          function: 'equal'
        });
        applyEqualNode.ele('FieldRef', {
          field: 'Sex'
        });
        applyEqualNode.ele('Constant', 'Male', {
          dataType: 'string'
        });
        applyIfNode.ele('Constant', {
          dataType: 'double'
        }, dataFields[dataField].Mean.Male ? dataFields[dataField].Mean.Male : 0);
        applyIfNode.ele('Constant', {
          dataType: 'double'
        }, dataFields[dataField].Mean.Female ? dataFields[dataField].Mean.Female : 0);
      }
    });
  } // Add DataDictionary node to PMML


  var dataDictionary = pmmlXml.ele('DataDictionary', {
    // Add 1 for gender
    numberOfFields: phiatCsvRowsWithoutReference.length + 1
  }); // Add DataField nodes for all rows which are not Reference types

  Object.keys(dataFields).forEach(function (dataField) {
    var dataFieldEle = dataDictionary.ele('DataField', {
      name: dataField,
      optype: parseVariableType(dataFields[dataField].variableType),
      dataType: 'double',
      displayName: undefined_1.returnEmptyStringIfUndefined(dataFields[dataField].displayName)
    });

    if (dataFields[dataField].Recommended === 'Yes') {
      dataFieldEle.ele('Extension', {
        name: 'recommended',
        value: 'true'
      });
    }

    dataFieldEle.ele('Extension', {
      name: 'units',
      value: undefined_1.returnEmptyStringIfUndefined(dataFields[dataField].Units)
    });
    dataFieldEle.ele('Extension', {
      name: 'description',
      value: undefined_1.returnEmptyStringIfUndefined(dataFields[dataField].displayValue)
    }); // If continuous add Interval node

    if (dataFields[dataField].variableType === 'continuous') {
      dataFieldEle.ele('Interval', {
        closure: 'closedClosed',
        leftMargin: undefined_1.returnEmptyStringIfUndefined(dataFields[dataField].UserMin),
        rightMargin: undefined_1.returnEmptyStringIfUndefined(dataFields[dataField].UserMax)
      });
    } else {
      // Otherwise its categorical so add Value nodes to DataField
      var relevantWebSpecificationCategory = webSpecificationCategories.find(function (webSpecificationCategory) {
        return webSpecificationCategory.name === dataField;
      });

      if (relevantWebSpecificationCategory) {
        relevantWebSpecificationCategory.categories.forEach(function (category) {
          dataFieldEle.ele('Value', {
            value: category.value,
            displayName: category.displayName,
            description: category.description
          });
        });
      } else {
        console.error(new Error("No categories found for DataField ".concat(dataField)));
      }
    }
  });
  var sexDataField = dataDictionary.ele('DataField', {
    name: 'Sex',
    opType: 'Categorical',
    dataType: 'string'
  });
  sexDataField.ele('Value', {
    value: 'Male'
  });
  sexDataField.ele('Value', {
    value: 'Female'
  }); // Convert to XML string

  var pmmlXmlString = pmmlXml.end({
    pretty: true
  }); // Return XML string

  return pmmlXmlString;
}

exports.transformPhiatDictionaryToPmml = transformPhiatDictionaryToPmml;
//# sourceMappingURL=web-spec-v1.js.map