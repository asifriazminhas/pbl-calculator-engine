"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm = convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm;

var _jsonModel = require("../parsers/json/json-model");

// tslint:disable-next-line
var csvParse = require('csv-parse/lib/sync');

function isEngineRefColumnNAForCauseEffectCsvRow(causeEffectCsvRow) {
  return causeEffectCsvRow.EngineRef === 'NA';
}

function isBothSexesCauseEffectCsvRow(causeEffectCsvRow) {
  return causeEffectCsvRow.Sex === 'Both';
}

function isMaleCauseEffectCsvRow(causeEffectCsvRow) {
  return causeEffectCsvRow.Sex === 'Male' || isBothSexesCauseEffectCsvRow(causeEffectCsvRow);
}

function isFemaleCauseEffectCsvRow(causeEffectCsvRow) {
  return causeEffectCsvRow.Sex === 'Female' || isBothSexesCauseEffectCsvRow(causeEffectCsvRow);
}

function filterOutRowsNotForAlgorithm(algorithm) {
  return function (causeEffectCsvRow) {
    /* Use indexOf since the Algorithm column can have more than one
    algorithm in it for example a row can be for both MPoRT and SPoRT */
    return causeEffectCsvRow.Algorithm.indexOf(algorithm) > -1;
  };
}

function getCauseEffectRefUpdateObjectForCauseEffectCsvRow(causeEffectCsvRow) {
  return isEngineRefColumnNAForCauseEffectCsvRow(causeEffectCsvRow) ? undefined : {
    name: causeEffectCsvRow.PredictorName,
    coefficent: causeEffectCsvRow.EngineRef
  };
}

function updateGenderCauseEffectRef(GenderCauseEffectRef, gender, riskFactor, update) {
  if (!GenderCauseEffectRef[gender][riskFactor]) {
    GenderCauseEffectRef[gender][riskFactor] = [];
  } // tslint:disable-next-line


  update ? GenderCauseEffectRef[gender][riskFactor].push(update) : undefined;
  return GenderCauseEffectRef;
}

function reduceToGenderCauseEffectRefObject(causeEffectRef, currentCauseEffectCsvRow) {
  if (isMaleCauseEffectCsvRow(currentCauseEffectCsvRow)) {
    updateGenderCauseEffectRef(causeEffectRef, 'male', currentCauseEffectCsvRow.RiskFactor, getCauseEffectRefUpdateObjectForCauseEffectCsvRow(currentCauseEffectCsvRow));
  }

  if (isFemaleCauseEffectCsvRow(currentCauseEffectCsvRow)) {
    updateGenderCauseEffectRef(causeEffectRef, 'female', currentCauseEffectCsvRow.RiskFactor, getCauseEffectRefUpdateObjectForCauseEffectCsvRow(currentCauseEffectCsvRow));
  }

  return causeEffectRef;
}

function checkGeneratedCauseEffectJson(causeEffectJson, model, modelName) {
  Object.keys(causeEffectJson).forEach(function (genderKey) {
    var algorithmJsonForCurrentGender = (0, _jsonModel.getAlgorithmJsonForPredicateData)(model, [{
      name: 'sex',
      coefficent: genderKey
    }]);
    Object.keys(causeEffectJson[genderKey]).forEach(function (riskFactor) {
      causeEffectJson[genderKey][riskFactor].forEach(function (datum) {
        var covariateFoundForCurrentDatum = algorithmJsonForCurrentGender.covariates.find(function (covariate) {
          return covariate.name === datum.name;
        });
        var derivedFieldFoundForCurrentDatum = algorithmJsonForCurrentGender.derivedFields.find(function (derivedField) {
          return derivedField.name === datum.name;
        });

        if (!covariateFoundForCurrentDatum && !derivedFieldFoundForCurrentDatum) {
          throw new Error( // tslint:disable-next-line
          "No covariate or derived field with name ".concat(datum.name, " found in ").concat(genderKey, " ").concat(modelName, " model "));
        }
      });
    });
  });
  return causeEffectJson;
}

function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(model, modelName, causeEffectCsvString) {
  var causeEffectCsv = csvParse(causeEffectCsvString, {
    columns: true
  });
  return checkGeneratedCauseEffectJson(causeEffectCsv.filter(filterOutRowsNotForAlgorithm(modelName))
  /* TODO Fix this later so that the male and female objects have
  risk factors prefilled with empty Data arrays to fix this TS error.*/
  .reduce(reduceToGenderCauseEffectRefObject, {
    male: {},
    female: {}
  }), model, modelName);
}
//# sourceMappingURL=cause-effect-csv-to-json.js.map