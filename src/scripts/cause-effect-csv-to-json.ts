import {
    IGenderCauseEffectRef,
    IGenderSpecificCauseEffectRef,
} from '../engine/cause-effect';
var csvParse = require('csv-parse/lib/sync');

export interface CauseEffectCsvRow {
    Algorithm: string;
    RiskFactor: string;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}

export type CauseEffectCsv = CauseEffectCsvRow[];

function isEngineRefColumnNAForCauseEffectCsvRow(
    causeEffectCsvRow: CauseEffectCsvRow,
): boolean {
    return causeEffectCsvRow.EngineRef === 'NA';
}

function isBothSexesCauseEffectCsvRow(
    causeEffectCsvRow: CauseEffectCsvRow,
): boolean {
    return causeEffectCsvRow.Sex === 'Both';
}

function isMaleCauseEffectCsvRow(
    causeEffectCsvRow: CauseEffectCsvRow,
): boolean {
    return (
        causeEffectCsvRow.Sex === 'Male' ||
        isBothSexesCauseEffectCsvRow(causeEffectCsvRow)
    );
}

function isFemaleCauseEffectCsvRow(
    causeEffectCsvRow: CauseEffectCsvRow,
): boolean {
    return (
        causeEffectCsvRow.Sex === 'Female' ||
        isBothSexesCauseEffectCsvRow(causeEffectCsvRow)
    );
}

function filterOutRowsNotForAlgorithm(
    algorithm: string,
): (causeEffectCsvRow: CauseEffectCsvRow) => boolean {
    return causeEffectCsvRow => {
        //Use indexOf since the Algorithm column can have more than one algorithm in it for example a row can be for both MPoRT and SPoRT
        return causeEffectCsvRow.Algorithm.indexOf(algorithm) > -1;
    };
}

function getCauseEffectRefUpdateObjectForCauseEffectCsvRow(
    causeEffectCsvRow: CauseEffectCsvRow,
): IGenderSpecificCauseEffectRef {
    return isEngineRefColumnNAForCauseEffectCsvRow(causeEffectCsvRow)
        ? {}
        : {
              [causeEffectCsvRow.PredictorName]: causeEffectCsvRow.EngineRef,
          };
}

function updateGenderCauseEffectRef(
    GenderCauseEffectRef: IGenderCauseEffectRef,
    gender: keyof IGenderCauseEffectRef,
    riskFactor: string,
    update: IGenderSpecificCauseEffectRef,
): IGenderCauseEffectRef {
    GenderCauseEffectRef[gender][riskFactor] = Object.assign(
        {},
        GenderCauseEffectRef[gender][riskFactor],
        update,
    );

    return GenderCauseEffectRef;
}

function reduceToGenderCauseEffectRefObject(
    causeEffectRef: IGenderCauseEffectRef,
    currentCauseEffectCsvRow: CauseEffectCsvRow,
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

export function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(
    algorithm: string,
    causeEffectCsvString: string,
): IGenderCauseEffectRef {
    const causeEffectCsv: CauseEffectCsv = csvParse(causeEffectCsvString, {
        columns: true,
    });

    return causeEffectCsv
        .filter(filterOutRowsNotForAlgorithm(algorithm))
        .reduce(reduceToGenderCauseEffectRefObject, {
            male: {},
            female: {},
        });
}
