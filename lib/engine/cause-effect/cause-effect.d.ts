import { IGenderCauseEffectRef } from './gender-cause-effect-ref';
import { Data } from '../data';
export interface IWithDataFunction {
    withData: (data: Data, ...otherArgs: any[]) => number;
}
export interface IGetCauseEffectFunction {
    getCauseEffect: (func: (data: Data, ...otherArgs: any[]) => number) => IWithDataFunction;
}
export declare type ForRiskFactorFunction = (riskFactor: string) => IGetCauseEffectFunction;
export declare type ForRiskFactorsFunction = (riskFactors: string[]) => IGetCauseEffectFunction;
export declare function getForRiskFactorFunction(genderEffectImpactRef: IGenderCauseEffectRef): {
    withRiskFactor: ForRiskFactorFunction;
    withRiskFactors: ForRiskFactorsFunction;
};
