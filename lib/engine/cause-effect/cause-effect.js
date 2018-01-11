"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gender_cause_effect_ref_1 = require("./gender-cause-effect-ref");
const data_1 = require("../data");
function getWithDataFunction(genderCauseEffectRef, riskFactors, func) {
    return {
        withData: (data, otherArgs) => {
            const causeEffectRef = gender_cause_effect_ref_1.getCauseEffectRefForData(genderCauseEffectRef, data);
            const causeEffectRefData = gender_cause_effect_ref_1.getCauseEffectDataForRiskFactors(riskFactors, causeEffectRef);
            return func(data_1.updateDataWithData(data, causeEffectRefData), otherArgs);
        },
    };
}
function getGetCauseEffectFunction(genderCauseEffectRef, riskFactors) {
    return {
        getCauseEffect: func => {
            return getWithDataFunction(genderCauseEffectRef, riskFactors, func);
        },
    };
}
function getForRiskFactorFunction(genderEffectImpactRef) {
    return {
        withRiskFactor: riskFactor => {
            return getGetCauseEffectFunction(genderEffectImpactRef, [
                riskFactor,
            ]);
        },
        withRiskFactors: riskFactors => {
            return getGetCauseEffectFunction(genderEffectImpactRef, riskFactors);
        },
    };
}
exports.getForRiskFactorFunction = getForRiskFactorFunction;
//# sourceMappingURL=cause-effect.js.map