"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const errors_1 = require("../errors");
function getCauseEffectRefForData(genderCauseEffectRef, data) {
    const sexDatum = data_1.findDatumWithName('sex', data);
    const causeEffectRefFound = genderCauseEffectRef[sexDatum.coefficent];
    if (!causeEffectRefFound) {
        throw new errors_1.NoCauseEffectRefFound(sexDatum.coefficent);
    }
    return causeEffectRefFound;
}
exports.getCauseEffectRefForData = getCauseEffectRefForData;
function getCauseEffectDataForRiskFactors(riskFactors, causeEffectRef) {
    return riskFactors
        .map(riskFactor => {
        return causeEffectRef[riskFactor];
    })
        .reduce((currentCauseEffectRefData, causeEffectRefData) => {
        return currentCauseEffectRefData.concat(causeEffectRefData);
    }, []);
}
exports.getCauseEffectDataForRiskFactors = getCauseEffectDataForRiskFactors;
//# sourceMappingURL=gender-cause-effect-ref.js.map