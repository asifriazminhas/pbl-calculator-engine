import { IGenderCauseEffectRef } from './gender-cause-effect-ref';
import { Data } from '../data';
import { RiskFactor } from '../../risk-factors';
export interface IWithDataFunction {
    withData: (data: Data, ...otherArgs: any[]) => number;
}
export interface IGetCauseEffectFunction {
    getCauseEffect: (func: (data: Data, ...otherArgs: any[]) => number) => IWithDataFunction;
}
export declare type ForRiskFactorFunction = (riskFactor: RiskFactor) => IGetCauseEffectFunction;
export declare type ForRiskFactorsFunction = (riskFactors: RiskFactor[]) => IGetCauseEffectFunction;
export declare function getForRiskFactorFunction(genderEffectImpactRef: IGenderCauseEffectRef): {
    withRiskFactor: ForRiskFactorFunction;
    withRiskFactors: ForRiskFactorsFunction;
};
