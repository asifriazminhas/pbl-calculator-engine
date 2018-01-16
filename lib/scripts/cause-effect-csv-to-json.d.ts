import { IGenderCauseEffectRef } from '../engine/cause-effect';
import { MultipleAlgorithmModelJson } from '../engine/multiple-algorithm-model/multiple-algorithm-model-json';
export interface ICauseEffectCsvRow {
    Algorithm: string;
    RiskFactor: string;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}
export declare type CauseEffectCsv = ICauseEffectCsvRow[];
export declare function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(model: MultipleAlgorithmModelJson, modelName: string, causeEffectCsvString: string): IGenderCauseEffectRef;
