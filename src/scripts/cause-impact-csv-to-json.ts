import { GenderSpecificCauseImpactRef, CauseImpactRef } from '../engine/cause-impact/cause-impact-ref';
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
    causeImpactCsvRow: CauseImpactCsvRow
): boolean {
    return causeImpactCsvRow.EngineRef === 'NA';
}

function isBothSexesCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow
): boolean {
    return causeImpactCsvRow.Sex === 'Both';
}

function isMaleCauseImpactCsvRow(causeImpactCsvRow: CauseImpactCsvRow): boolean {
    return causeImpactCsvRow.Sex === 'Male' || isBothSexesCauseImpactCsvRow(
        causeImpactCsvRow
    );
}

function isFemaleCauseImpactCsvRow(causeImpactCsvRow: CauseImpactCsvRow): boolean {
    return causeImpactCsvRow.Sex === 'Female' || isBothSexesCauseImpactCsvRow(
        causeImpactCsvRow
    );
}

function filterOutRowsNotForAlgorithm(
    algorithm: string
): (causeImpactCsvRow: CauseImpactCsvRow) => boolean  {
    return (causeImpactCsvRow) => {
        //Use indexOf since the Algorithm column can have more than one algorithm in it for example a row can be for both MPoRT and SPoRT
        return causeImpactCsvRow.Algorithm.indexOf(algorithm) > -1
    };
}

function getCauseImpactRefUpdateObjectForCauseImpactCsvRow(
    causeImpactCsvRow: CauseImpactCsvRow
): CauseImpactRef  {
    return isEngineRefColumnNAForCauseImpactCsvRow(
        causeImpactCsvRow
    ) ? {} : {
        [causeImpactCsvRow.PredictorName]: causeImpactCsvRow.EngineRef
    };
}

function updateGenderSpecificCauseImpactRef(
    genderSpecificCauseImpactRef: GenderSpecificCauseImpactRef,
    gender: keyof GenderSpecificCauseImpactRef,
    riskFactor: string,
    update: CauseImpactRef
): GenderSpecificCauseImpactRef {
    genderSpecificCauseImpactRef[gender][riskFactor] = Object
    .assign(
        {}, 
        genderSpecificCauseImpactRef[gender][riskFactor], 
        update
    ); 

    return genderSpecificCauseImpactRef;
}

function reduceToGenderSpecificCauseImpactRefObject(
    causeImpactRef: GenderSpecificCauseImpactRef,
    currentCauseImpactCsvRow: CauseImpactCsvRow
): GenderSpecificCauseImpactRef {
    if(isMaleCauseImpactCsvRow(currentCauseImpactCsvRow)) {
        updateGenderSpecificCauseImpactRef(
            causeImpactRef,
            'male',
            currentCauseImpactCsvRow.RiskFactor,
            getCauseImpactRefUpdateObjectForCauseImpactCsvRow(
                currentCauseImpactCsvRow
            )
        );
    }
    if(isFemaleCauseImpactCsvRow(currentCauseImpactCsvRow)) {
        updateGenderSpecificCauseImpactRef(
            causeImpactRef,
            'female',
            currentCauseImpactCsvRow.RiskFactor,
            getCauseImpactRefUpdateObjectForCauseImpactCsvRow(
                currentCauseImpactCsvRow
            )
        );
    }

    return causeImpactRef;
}

export function convertCauseImpactCsvToGenderSpecificCauseImpactRefForAlgorithm(
    algorithm: string,
    causeImpactCsvString: string
): GenderSpecificCauseImpactRef 
{
    const causeImpactCsv: CauseImpactCsv = csvParse(causeImpactCsvString, {
        columns: true
    });

    return causeImpactCsv
        .filter(filterOutRowsNotForAlgorithm(algorithm))
        .reduce(reduceToGenderSpecificCauseImpactRefObject, {
            'male': {},
            'female': {}
        });
}