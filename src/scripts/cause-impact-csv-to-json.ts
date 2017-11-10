import {
    GenderCauseImpactRef,
    GenderSpecificCauseImpactRef,
} from '../engine/cause-impact';
var csvParse = require('csv-parse/lib/sync');

export interface CauseImpactCsvRow {
    Algorithm: string;
    RiskFactor: string;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}

export type CauseImpactCsv = CauseImpactCsvRow[];

function isEngineRefColumnNAForCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow,
): boolean {
    return causeImpactCsvRow.EngineRef === 'NA';
}

function isBothSexesCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow,
): boolean {
    return causeImpactCsvRow.Sex === 'Both';
}

function isMaleCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow,
): boolean {
    return (
        causeImpactCsvRow.Sex === 'Male' ||
        isBothSexesCauseImpactCsvRow(causeImpactCsvRow)
    );
}

function isFemaleCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow,
): boolean {
    return (
        causeImpactCsvRow.Sex === 'Female' ||
        isBothSexesCauseImpactCsvRow(causeImpactCsvRow)
    );
}

function filterOutRowsNotForAlgorithm(
    algorithm: string,
): (causeImpactCsvRow: CauseImpactCsvRow) => boolean {
    return causeImpactCsvRow => {
        //Use indexOf since the Algorithm column can have more than one algorithm in it for example a row can be for both MPoRT and SPoRT
        return causeImpactCsvRow.Algorithm.indexOf(algorithm) > -1;
    };
}

function getCauseImpactRefUpdateObjectForCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow,
): GenderSpecificCauseImpactRef {
    return isEngineRefColumnNAForCauseImpactCsvRow(causeImpactCsvRow)
        ? {}
        : {
              [causeImpactCsvRow.PredictorName]: causeImpactCsvRow.EngineRef,
          };
}

function updateGenderCauseImpactRef(
    GenderCauseImpactRef: GenderCauseImpactRef,
    gender: keyof GenderCauseImpactRef,
    riskFactor: string,
    update: GenderSpecificCauseImpactRef,
): GenderCauseImpactRef {
    GenderCauseImpactRef[gender][riskFactor] = Object.assign(
        {},
        GenderCauseImpactRef[gender][riskFactor],
        update,
    );

    return GenderCauseImpactRef;
}

function reduceToGenderCauseImpactRefObject(
    causeImpactRef: GenderCauseImpactRef,
    currentCauseImpactCsvRow: CauseImpactCsvRow,
): GenderCauseImpactRef {
    if (isMaleCauseImpactCsvRow(currentCauseImpactCsvRow)) {
        updateGenderCauseImpactRef(
            causeImpactRef,
            'male',
            currentCauseImpactCsvRow.RiskFactor,
            getCauseImpactRefUpdateObjectForCauseImpactCsvRow(
                currentCauseImpactCsvRow,
            ),
        );
    }
    if (isFemaleCauseImpactCsvRow(currentCauseImpactCsvRow)) {
        updateGenderCauseImpactRef(
            causeImpactRef,
            'female',
            currentCauseImpactCsvRow.RiskFactor,
            getCauseImpactRefUpdateObjectForCauseImpactCsvRow(
                currentCauseImpactCsvRow,
            ),
        );
    }

    return causeImpactRef;
}

export function convertCauseImpactCsvToGenderCauseImpactRefForAlgorithm(
    algorithm: string,
    causeImpactCsvString: string,
): GenderCauseImpactRef {
    const causeImpactCsv: CauseImpactCsv = csvParse(causeImpactCsvString, {
        columns: true,
    });

    return causeImpactCsv
        .filter(filterOutRowsNotForAlgorithm(algorithm))
        .reduce(reduceToGenderCauseImpactRefObject, {
            male: {},
            female: {},
        });
}
