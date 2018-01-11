import { GenericBaseNonInteractionCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate } from './generic-covariate';
import { Covariate } from './covariate';
import { IBaseCovariate } from './base-covariate';
export interface IBaseNonInteractionCovariate extends GenericBaseNonInteractionCovariate<Covariate>, IBaseCovariate {
}
export interface ICategoricalNonInteractionCovariate extends GenericCategoricalNonInteractionCovariate<Covariate>, IBaseNonInteractionCovariate {
}
export interface IContinuousNonInteractionCovariate extends GenericContinuousNonInteractionCovariate<Covariate>, IBaseNonInteractionCovariate {
}
export declare type NonInteractionCovariate = IBaseNonInteractionCovariate | ICategoricalNonInteractionCovariate | IContinuousNonInteractionCovariate;
