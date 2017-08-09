import { GenericNonInteractionCovariateWithoutOpType, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate } from '../common/generic-types';
import { Covariate } from './covariate';
import { DerivedField } from './derived-field';

export interface NonInteractionCovariateWithoutOpType extends GenericNonInteractionCovariateWithoutOpType<Covariate> {
    derivedField: DerivedField | undefined
}

export interface CategoricalNonInteractionCovariate extends GenericCategoricalNonInteractionCovariate<Covariate> {
    derivedField: DerivedField | undefined
}

export interface ContinuousNonInteractionCovariate extends GenericContinuousNonInteractionCovariate<Covariate> {
    derivedField: DerivedField | undefined
}

export type NonInteractionCovariate = NonInteractionCovariateWithoutOpType | CategoricalNonInteractionCovariate | ContinuousNonInteractionCovariate;