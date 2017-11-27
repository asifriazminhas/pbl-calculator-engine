import { IGenderCauseEffectRef } from '../engine/cause-effect';
export interface ICauseEffectCsvRow {
    Algorithm: string;
    RiskFactor: string;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}
export declare type CauseEffectCsv = ICauseEffectCsvRow[];
export declare function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(algorithm: string, causeEffectCsvString: string): IGenderCauseEffectRef;
