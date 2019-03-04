"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var csvParse = require("csv-parse/lib/sync");

var xmlbuilder_1 = require("../../../util/xmlbuilder");

var invalid_value_treatment_1 = require("../../../parsers/pmml/mining-schema/invalid-value-treatment");

var missing_value_treatment_1 = require("../../../parsers/pmml/mining-schema/missing-value-treatment");

function convertWebSpecV2CsvToPmml(webSpecV2CsvString, gender) {
  var webSpecV2Csv = csvParse(webSpecV2CsvString, {
    columns: true
  });
  var Header = {
    $: {
      description: 'WebSpecV2 PMML'
    }
  };
  var numOfRowsWithDefinedMinOrMaxColumn = webSpecV2Csv.filter(function (webSpecV2CsvRow) {
    var _getGenderSpecificMin = getGenderSpecificMinAndMaxValues(webSpecV2CsvRow, gender),
        min = _getGenderSpecificMin.min,
        max = _getGenderSpecificMin.max;

    return min || max;
  }).length;
  var DataDictionary = {
    DataField: webSpecV2Csv.map(function (webSpecV2CsvRow) {
      return getDataFieldNode(webSpecV2CsvRow, gender);
    }),
    $: {
      numberOfFields: "".concat(numOfRowsWithDefinedMinOrMaxColumn)
    }
  };
  var MiningSchema = {
    MiningField: webSpecV2Csv.map(function (_ref) {
      var InvalidValueTreatment = _ref.InvalidValueTreatment,
          Name = _ref.Name,
          MissingValueReplacement = _ref.MissingValueReplacement;
      return {
        $: Object.assign({
          name: Name,
          invalidValueTreatment: InvalidValueTreatment === 'asMissing' ? invalid_value_treatment_1.InvalidValueTreatment.AsMissing : InvalidValueTreatment === 'returnInvalid' ? invalid_value_treatment_1.InvalidValueTreatment.ReturnInvalid : invalid_value_treatment_1.InvalidValueTreatment.AsIs
        }, MissingValueReplacement === 'asMean' ? {
          missingValueTreatment: missing_value_treatment_1.MissingValueTreatment.AsMean
        } : undefined)
      };
    })
  };
  var pmml = {
    Header: Header,
    DataDictionary: DataDictionary,
    LocalTransformations: {
      DerivedField: []
    },
    MiningSchema: MiningSchema
  };
  return xmlbuilder_1.buildXmlFromXml2JsObject({
    PMML: pmml
  });
}

exports.convertWebSpecV2CsvToPmml = convertWebSpecV2CsvToPmml;

function isMaleGender(gender) {
  return gender === 'male';
}

function getDataFieldNode(webSpecV2CsvRow, gender) {
  var _getGenderSpecificMin2 = getGenderSpecificMinAndMaxValues(webSpecV2CsvRow, gender),
      min = _getGenderSpecificMin2.min,
      max = _getGenderSpecificMin2.max;

  return Object.assign({}, {
    $: {
      name: webSpecV2CsvRow.Name,
      displayName: '',
      optype: 'continuous',
      dataType: '',
      'X-shortLabel': ''
    },
    Extension: []
  }, min || max ? {
    Interval: getIntervalNode(min, max)
  } : undefined);
}

function getGenderSpecificMinAndMaxValues(webSpecV2CsvRow, gender) {
  return {
    min: isMaleGender(gender) ? webSpecV2CsvRow.UserMin_male : webSpecV2CsvRow.UserMin_female,
    max: isMaleGender(gender) ? webSpecV2CsvRow.UserMax_male : webSpecV2CsvRow.UserMax_female
  };
}

function getIntervalNode(min, max) {
  return {
    $: Object.assign({}, {
      closure: 'closedClosed'
    }, min ? {
      leftMargin: min
    } : undefined, max ? {
      rightMargin: max
    } : undefined)
  };
}
//# sourceMappingURL=web-spec-v2.js.map