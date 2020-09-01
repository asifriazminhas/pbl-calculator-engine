"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getForRiskFactorFunction = getForRiskFactorFunction;

var _genderCauseEffectRef = require("./gender-cause-effect-ref");

var _data = require("../data");

function getWithDataFunction(genderCauseEffectRef, riskFactors, func) {
  return {
    withData: function withData(data, otherArgs) {
      var causeEffectRef = (0, _genderCauseEffectRef.getCauseEffectRefForData)(genderCauseEffectRef, data);
      var causeEffectRefData = (0, _genderCauseEffectRef.getCauseEffectDataForRiskFactors)(riskFactors, causeEffectRef);
      return func((0, _data.updateDataWithData)(data, causeEffectRefData), otherArgs);
    }
  };
}

function getGetCauseEffectFunction(genderCauseEffectRef, riskFactors) {
  return {
    getCauseEffect: function getCauseEffect(func) {
      return getWithDataFunction(genderCauseEffectRef, riskFactors, func);
    }
  };
}

function getForRiskFactorFunction(genderEffectImpactRef) {
  return {
    withRiskFactor: function withRiskFactor(riskFactor) {
      return getGetCauseEffectFunction(genderEffectImpactRef, [riskFactor]);
    },
    withRiskFactors: function withRiskFactors(riskFactors) {
      return getGetCauseEffectFunction(genderEffectImpactRef, riskFactors);
    }
  };
}
//# sourceMappingURL=cause-effect.js.map