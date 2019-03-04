import { IGenderCauseEffectRef } from '../engine/cause-effect';
import { IModelJson } from '../parsers/json/json-model';
import { CovariateGroup } from '../engine/data-field/covariate/covariate-group';
export interface ICauseEffectCsvRow {
    Algorithm: string;
    RiskFactor: CovariateGroup;
    Sex: 'Male' | 'Female' | 'Both';
    PredictorName: string;
    EngineRef: string | 'NA';
}
export declare type CauseEffectCsv = ICauseEffectCsvRow[];
export declare function convertCauseEffectCsvToGenderCauseEffectRefForAlgorithm(model: IModelJson, modelName: string, causeEffectCsvString: string): IGenderCauseEffectRef;
