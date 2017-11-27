import { Data } from '../data';
export interface IGenderSpecificCauseEffectRef {
    [index: string]: Data;
}
export interface IGenderCauseEffectRef {
    [index: string]: IGenderSpecificCauseEffectRef;
    male: IGenderSpecificCauseEffectRef;
    female: IGenderSpecificCauseEffectRef;
}
export declare function getCauseEffectRefForData(genderCauseEffectRef: IGenderCauseEffectRef, data: Data): IGenderSpecificCauseEffectRef;
export declare function getCauseEffectDataForRiskFactors(riskFactors: string[], causeEffectRef: IGenderSpecificCauseEffectRef): Data;
