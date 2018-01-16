"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_model_types_1 = require("../engine/model/json-model-types");
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
function checkGeneratedCauseEffectJson(causeEffectJson, model, modelName) {
    Object.keys(causeEffectJson).forEach(genderKey => {
        const algorithmJsonForCurrentGender = json_model_types_1.getAlgorithmJsonForModelAndData(model, [
            {
                name: 'sex',
                coefficent: genderKey,
            },
        ]);
        Object.keys(causeEffectJson[genderKey]).forEach(riskFactor => {
            causeEffectJson[genderKey][riskFactor].forEach(datum => {
                const covariateFoundForCurrentDatum = algorithmJsonForCurrentGender.covariates.find(covariate => {
                    return covariate.name === datum.name;
                });
                const derivedFieldFoundForCurrentDatum = algorithmJsonForCurrentGender.derivedFields.find(derivedField => {
                    return derivedField.name === datum.name;
                });
                if (!covariateFoundForCurrentDatum &&
                    !derivedFieldFoundForCurrentDatum) {
                    throw new Error(
                    // tslint:disable-next-line
                    `No covariate or derived field with name ${datum.name} found in ${genderKey} ${modelName} model `);
                }
            });
        });
    });
    return causeEffectJson;
}
function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(model, modelName, causeEffectCsvString) {
    const causeEffectCsv = csvParse(causeEffectCsvString, {
        columns: true,
    });
    return checkGeneratedCauseEffectJson(causeEffectCsv
        .filter(filterOutRowsNotForAlgorithm(modelName))
        .reduce(reduceToGenderCauseEffectRefObject, {
        male: {},
        female: {},
    }), model, modelName);
}
exports.convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm = convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm;
//# sourceMappingURL=cause-effect-csv-to-json.js.map