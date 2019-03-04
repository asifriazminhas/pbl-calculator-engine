import { Data } from '../data';
import { CovariateGroup } from '../data-field/covariate/covariate-group';
export declare type IGenderSpecificCauseEffectRef = {
    [K in CovariateGroup]: Data;
};
export interface IGenderCauseEffectRef {
    [index: string]: IGenderSpecificCauseEffectRef;
    male: IGenderSpecificCauseEffectRef;
    female: IGenderSpecificCauseEffectRef;
}
export declare function getCauseEffectRefForData(genderCauseEffectRef: IGenderCauseEffectRef, data: Data): IGenderSpecificCauseEffectRef;
export declare function getCauseEffectDataForRiskFactors(riskFactors: CovariateGroup[], causeEffectRef: IGenderSpecificCauseEffectRef): Data;
