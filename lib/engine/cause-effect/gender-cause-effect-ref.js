"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var data_1 = require("../data");

var errors_1 = require("../errors");

function getCauseEffectRefForData(genderCauseEffectRef, data) {
  var sexDatum = data_1.findDatumWithName('sex', data);
  var causeEffectRefFound = genderCauseEffectRef[sexDatum.coefficent];

  if (!causeEffectRefFound) {
    throw new errors_1.NoCauseEffectRefFound(sexDatum.coefficent);
  }

  return causeEffectRefFound;
}

exports.getCauseEffectRefForData = getCauseEffectRefForData;

function getCauseEffectDataForRiskFactors(riskFactors, causeEffectRef) {
  return riskFactors.map(function (riskFactor) {
    return causeEffectRef[riskFactor];
  }).reduce(function (currentCauseEffectRefData, causeEffectRefData) {
    return currentCauseEffectRefData.concat(causeEffectRefData);
  }, []);
}

exports.getCauseEffectDataForRiskFactors = getCauseEffectDataForRiskFactors;
//# sourceMappingURL=gender-cause-effect-ref.js.map