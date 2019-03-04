"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var gender_cause_effect_ref_1 = require("./gender-cause-effect-ref");

var data_1 = require("../data");

function getWithDataFunction(genderCauseEffectRef, riskFactors, func) {
  return {
    withData: function withData(data, otherArgs) {
      var causeEffectRef = gender_cause_effect_ref_1.getCauseEffectRefForData(genderCauseEffectRef, data);
      var causeEffectRefData = gender_cause_effect_ref_1.getCauseEffectDataForRiskFactors(riskFactors, causeEffectRef);
      return func(data_1.updateDataWithData(data, causeEffectRefData), otherArgs);
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

exports.getForRiskFactorFunction = getForRiskFactorFunction;
//# sourceMappingURL=cause-effect.js.map