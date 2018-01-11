"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
var csvParse = require('csv-parse/lib/sync');
function isEngineRefColumnNAForCauseEffectCsvRow(causeEffectCsvRow) {
    return causeEffectCsvRow.EngineRef === 'NA';
}
function isBothSexesCauseEffectCsvRow(causeEffectCsvRow) {
    return causeEffectCsvRow.Sex === 'Both';
}
function isMaleCauseEffectCsvRow(causeEffectCsvRow) {
    return (causeEffectCsvRow.Sex === 'Male' ||
        isBothSexesCauseEffectCsvRow(causeEffectCsvRow));
}
function isFemaleCauseEffectCsvRow(causeEffectCsvRow) {
    return (causeEffectCsvRow.Sex === 'Female' ||
        isBothSexesCauseEffectCsvRow(causeEffectCsvRow));
}
function filterOutRowsNotForAlgorithm(algorithm) {
    return causeEffectCsvRow => {
        /* Use indexOf since the Algorithm column can have more than one
        algorithm in it for example a row can be for both MPoRT and SPoRT */
        return causeEffectCsvRow.Algorithm.indexOf(algorithm) > -1;
    };
}
function getCauseEffectRefUpdateObjectForCauseEffectCsvRow(causeEffectCsvRow) {
    return isEngineRefColumnNAForCauseEffectCsvRow(causeEffectCsvRow)
        ? undefined
        : {
            name: causeEffectCsvRow.PredictorName,
            coefficent: causeEffectCsvRow.EngineRef,
        };
}
function updateGenderCauseEffectRef(GenderCauseEffectRef, gender, riskFactor, update) {
    if (!GenderCauseEffectRef[gender][riskFactor]) {
        GenderCauseEffectRef[gender][riskFactor] = [];
    }
    // tslint:disable-next-line
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
function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(algorithm, causeEffectCsvString) {
    const causeEffectCsv = csvParse(causeEffectCsvString, {
        columns: true,
    });
    return causeEffectCsv
        .filter(filterOutRowsNotForAlgorithm(algorithm))
        .reduce(reduceToGenderCauseEffectRefObject, {
        male: {},
        female: {},
    });
}
exports.convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm = convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm;
//# sourceMappingURL=cause-effect-csv-to-json.js.map