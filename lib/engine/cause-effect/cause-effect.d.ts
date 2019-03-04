import { IGenderCauseEffectRef } from './gender-cause-effect-ref';
import { Data } from '../data';
import { CovariateGroup } from '../data-field/covariate/covariate-group';
export interface IWithDataFunction {
    withData: (data: Data, ...otherArgs: any[]) => number;
}
export interface IGetCauseEffectFunction {
    getCauseEffect: (func: (data: Data, ...otherArgs: any[]) => number) => IWithDataFunction;
}
export declare type ForRiskFactorFunction = (riskFactor: CovariateGroup) => IGetCauseEffectFunction;
export declare type ForRiskFactorsFunction = (riskFactors: CovariateGroup[]) => IGetCauseEffectFunction;
export declare function getForRiskFactorFunction(genderEffectImpactRef: IGenderCauseEffectRef): {
    withRiskFactor: ForRiskFactorFunction;
    withRiskFactors: ForRiskFactorsFunction;
};
