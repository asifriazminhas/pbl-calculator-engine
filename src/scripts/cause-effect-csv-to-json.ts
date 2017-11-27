import { IGenderCauseEffectRef } from '../engine/cause-effect';
import { IDatum } from '../engine/data';
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
