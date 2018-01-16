import { IGenderCauseEffectRef } from '../engine/cause-effect';
import { IDatum } from '../engine/data';
import { getAlgorithmJsonForModelAndData } from '../engine/model/json-model-types';
import { MultipleAlgorithmModelJson } from '../engine/multiple-algorithm-model/multiple-algorithm-model-json';
import { ICoxJson } from '../engine/cox/cox-json';
// tslint:disable-next-line
var csvParse = require('csv-parse/lib/sync');

export interface ICauseEffectCsvRow {
    Algorithm: string;
    RiskFactor: string;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}

export type CauseEffectCsv = ICauseEffectCsvRow[];

function isEngineRefColumnNAForCauseEffectCsvRow(
    causeEffectCsvRow: ICauseEffectCsvRow,
): boolean {
    return causeEffectCsvRow.EngineRef === 'NA';
}

function isBothSexesCauseEffectCsvRow(
    causeEffectCsvRow: ICauseEffectCsvRow,
): boolean {
    return causeEffectCsvRow.Sex === 'Both';
}

function isMaleCauseEffectCsvRow(
    causeEffectCsvRow: ICauseEffectCsvRow,
): boolean {
    return (
        causeEffectCsvRow.Sex === 'Male' ||
        isBothSexesCauseEffectCsvRow(causeEffectCsvRow)
    );
}

function isFemaleCauseEffectCsvRow(
    causeEffectCsvRow: ICauseEffectCsvRow,
): boolean {
    return (
        causeEffectCsvRow.Sex === 'Female' ||
        isBothSexesCauseEffectCsvRow(causeEffectCsvRow)
    );
}

function filterOutRowsNotForAlgorithm(
    algorithm: string,
): (causeEffectCsvRow: ICauseEffectCsvRow) => boolean {
    return causeEffectCsvRow => {
        /* Use indexOf since the Algorithm column can have more than one
        algorithm in it for example a row can be for both MPoRT and SPoRT */
        return causeEffectCsvRow.Algorithm.indexOf(algorithm) > -1;
    };
}

function getCauseEffectRefUpdateObjectForCauseEffectCsvRow(
    causeEffectCsvRow: ICauseEffectCsvRow,
): IDatum | undefined {
    return isEngineRefColumnNAForCauseEffectCsvRow(causeEffectCsvRow)
        ? undefined
        : {
              name: causeEffectCsvRow.PredictorName,
              coefficent: causeEffectCsvRow.EngineRef,
          };
}

function updateGenderCauseEffectRef(
    GenderCauseEffectRef: IGenderCauseEffectRef,
    gender: keyof IGenderCauseEffectRef,
    riskFactor: string,
    update: IDatum | undefined,
): IGenderCauseEffectRef {
    if (!GenderCauseEffectRef[gender][riskFactor]) {
        GenderCauseEffectRef[gender][riskFactor] = [];
    }
    // tslint:disable-next-line
    update ? GenderCauseEffectRef[gender][riskFactor].push(update) : undefined;

    return GenderCauseEffectRef;
}

function reduceToGenderCauseEffectRefObject(
    causeEffectRef: IGenderCauseEffectRef,
    currentCauseEffectCsvRow: ICauseEffectCsvRow,
): IGenderCauseEffectRef {
    if (isMaleCauseEffectCsvRow(currentCauseEffectCsvRow)) {
        updateGenderCauseEffectRef(
            causeEffectRef,
            'male',
            currentCauseEffectCsvRow.RiskFactor,
            getCauseEffectRefUpdateObjectForCauseEffectCsvRow(
                currentCauseEffectCsvRow,
            ),
        );
    }
    if (isFemaleCauseEffectCsvRow(currentCauseEffectCsvRow)) {
        updateGenderCauseEffectRef(
            causeEffectRef,
            'female',
            currentCauseEffectCsvRow.RiskFactor,
            getCauseEffectRefUpdateObjectForCauseEffectCsvRow(
                currentCauseEffectCsvRow,
            ),
        );
    }

    return causeEffectRef;
}

function checkGeneratedCauseEffectJson(
    causeEffectJson: IGenderCauseEffectRef,
    model: MultipleAlgorithmModelJson,
    modelName: string,
): IGenderCauseEffectRef {
    Object.keys(causeEffectJson).forEach(genderKey => {
        const algorithmJsonForCurrentGender = getAlgorithmJsonForModelAndData(
            model,
            [
                {
                    name: 'sex',
                    coefficent: genderKey,
                },
            ],
        );

        Object.keys(causeEffectJson[genderKey]).forEach(riskFactor => {
            causeEffectJson[genderKey][riskFactor].forEach(datum => {
                const covariateFoundForCurrentDatum = (algorithmJsonForCurrentGender as ICoxJson).covariates.find(
                    covariate => {
                        return covariate.name === datum.name;
                    },
                );

                if (!covariateFoundForCurrentDatum) {
                    throw new Error(
                        `No covariate with name ${datum.name} found in ${genderKey} ${modelName} model `,
                    );
                }
            });
        });
    });

    return causeEffectJson;
}
export function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(
    model: MultipleAlgorithmModelJson,
    modelName: string,
    causeEffectCsvString: string,
): IGenderCauseEffectRef {
    const causeEffectCsv: CauseEffectCsv = csvParse(causeEffectCsvString, {
        columns: true,
    });

    return checkGeneratedCauseEffectJson(
        causeEffectCsv
            .filter(filterOutRowsNotForAlgorithm(modelName))
            .reduce(reduceToGenderCauseEffectRefObject, {
                male: {},
                female: {},
            }),
        model,
        modelName,
    );
}
