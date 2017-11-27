import { GenericBaseInteractionCovariate, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate } from './generic-covariate';
import { Covariate } from './covariate';
import { IBaseCovariate } from './base-covariate';
import { DerivedField } from '../derived-field';
import { IDatum, Data } from '../data';
import { Cox } from '../cox';
export interface IBaseInteractionCovariate extends GenericBaseInteractionCovariate<Covariate>, IBaseCovariate {
    derivedField: DerivedField;
}
export interface ICategoricalInteractionCovariate extends GenericCategoricalInteractionCovariate<Covariate>, IBaseInteractionCovariate {
}
export interface IContinuousInteractionCovariate extends GenericContinuousInteractionCovariate<Covariate>, IBaseInteractionCovariate {
}
export declare type InteractionCovariate = IBaseInteractionCovariate | ICategoricalInteractionCovariate | IContinuousInteractionCovariate;
export declare function calculateDataToCalculateCoefficent(interactionCovariate: InteractionCovariate, data: Data, userDefinedFunctions: Cox['userFunctions']): IDatum[];
