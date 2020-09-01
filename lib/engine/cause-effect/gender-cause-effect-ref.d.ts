import { Data, IDatum } from '../data';
import { RiskFactor } from '../../risk-factors';
export declare type IGenderSpecificCauseEffectRef = {
    [K in RiskFactor]: Array<{
        clamp?: {
            lower?: boolean;
            upper?: boolean;
        };
    } & IDatum>;
};
export interface IGenderCauseEffectRef {
    [index: string]: IGenderSpecificCauseEffectRef;
    male: IGenderSpecificCauseEffectRef;
    female: IGenderSpecificCauseEffectRef;
}
export declare function getCauseEffectRefForData(genderCauseEffectRef: IGenderCauseEffectRef, data: Data, sexField?: string): IGenderSpecificCauseEffectRef;
export declare function getCauseEffectDataForRiskFactors(riskFactors: RiskFactor[], causeEffectRef: IGenderSpecificCauseEffectRef): Data;
