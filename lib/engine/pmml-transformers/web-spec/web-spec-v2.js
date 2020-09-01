"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertWebSpecV2CsvToPmml = convertWebSpecV2CsvToPmml;

var _xmlbuilder = require("../../../util/xmlbuilder");

var _invalidValueTreatment = require("../../../parsers/pmml/mining-schema/invalid-value-treatment");

var _missingValueTreatment = require("../../../parsers/pmml/mining-schema/missing-value-treatment");

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
          invalidValueTreatment: InvalidValueTreatment === 'asMissing' ? _invalidValueTreatment.InvalidValueTreatment.AsMissing : InvalidValueTreatment === 'returnInvalid' ? _invalidValueTreatment.InvalidValueTreatment.ReturnInvalid : _invalidValueTreatment.InvalidValueTreatment.AsIs
        }, MissingValueReplacement === 'asMean' ? {
          missingValueTreatment: _missingValueTreatment.MissingValueTreatment.AsMean
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
  return (0, _xmlbuilder.buildXmlFromXml2JsObject)({
    PMML: pmml
  });
}

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
      'X-shortLabel': '',
      'X-required': 'false',
      'X-recommended': 'false'
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
      closure: 'closedClosed',
      'X-description': ''
    }, min ? {
      leftMargin: min
    } : undefined, max ? {
      rightMargin: max
    } : undefined)
  };
}
//# sourceMappingURL=web-spec-v2.js.map