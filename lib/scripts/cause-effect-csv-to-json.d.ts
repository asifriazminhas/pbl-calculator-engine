import { IGenderCauseEffectRef } from '../engine/cause-effect';
import { IModelJson } from '../parsers/json/json-model';
import { RiskFactor } from '../risk-factors';
import { ICoxSurvivalAlgorithmJson } from '../parsers/json/json-cox-survival-algorithm';
export interface ICauseEffectCsvRow {
    Algorithm: string;
    RiskFactor: RiskFactor;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}
export declare type CauseEffectCsv = ICauseEffectCsvRow[];
export declare function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(model: IModelJson<ICoxSurvivalAlgorithmJson>, modelName: string, causeEffectCsvString: string): IGenderCauseEffectRef;
