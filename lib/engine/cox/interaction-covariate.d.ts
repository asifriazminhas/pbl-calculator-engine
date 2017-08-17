import { GenericInteractionCovariateWithoutOpType, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate } from '../common/generic-types';
import { DerivedField } from './derived-field';
import { Covariate } from './covariate';
import { Data, Datum } from '../common/datum';
export interface InteractionCovariateWithoutOpType extends GenericInteractionCovariateWithoutOpType<Covariate> {
    derivedField: DerivedField;
}
export interface CategoricalInteractionCovariate extends GenericCategoricalInteractionCovariate<Covariate>, InteractionCovariateWithoutOpType {
}
export interface ContinuousInteractionCovariate extends GenericContinuousInteractionCovariate<Covariate>, InteractionCovariateWithoutOpType {
}
export declare type InteractionCovariate = InteractionCovariateWithoutOpType | CategoricalInteractionCovariate | ContinuousInteractionCovariate;
export declare function calculateDataToCalculateCoefficent(interactionCovariate: InteractionCovariate, data: Data): Array<Datum>;
