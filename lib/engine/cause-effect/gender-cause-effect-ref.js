"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCauseEffectRefForData = getCauseEffectRefForData;
exports.getCauseEffectDataForRiskFactors = getCauseEffectDataForRiskFactors;

var _data = require("../data");

var _errors = require("../errors");

function getCauseEffectRefForData(genderCauseEffectRef, data) {
  var sexField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sex';
  var sexDatum = (0, _data.findDatumWithName)(sexField, data);
  var causeEffectRefFound = genderCauseEffectRef[sexDatum.coefficent];

  if (!causeEffectRefFound) {
    throw new _errors.NoCauseEffectRefFound(sexDatum.coefficent);
  }

  return causeEffectRefFound;
}

function getCauseEffectDataForRiskFactors(riskFactors, causeEffectRef) {
  return riskFactors.map(function (riskFactor) {
    return causeEffectRef[riskFactor];
  }).reduce(function (currentCauseEffectRefData, causeEffectRefData) {
    return currentCauseEffectRefData.concat(causeEffectRefData);
  }, []);
}
//# sourceMappingURL=gender-cause-effect-ref.js.map