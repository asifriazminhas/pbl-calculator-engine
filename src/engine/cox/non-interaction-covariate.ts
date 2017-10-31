import { GenericBaseNonInteractionCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate } from '../covariate';
import { Covariate } from './covariate';
import { DerivedField } from './derived-field';

export interface NonInteractionCovariateWithoutOpType extends GenericBaseNonInteractionCovariate<Covariate> {
    derivedField: DerivedField | undefined
}

export interface CategoricalNonInteractionCovariate extends GenericCategoricalNonInteractionCovariate<Covariate> {
    derivedField: DerivedField | undefined
}

export interface ContinuousNonInteractionCovariate extends GenericContinuousNonInteractionCovariate<Covariate> {
    derivedField: DerivedField | undefined
}

export type NonInteractionCovariate = NonInteractionCovariateWithoutOpType | CategoricalNonInteractionCovariate | ContinuousNonInteractionCovariate;