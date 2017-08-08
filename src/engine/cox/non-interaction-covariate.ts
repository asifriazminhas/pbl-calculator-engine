import { GenericNonInteractionCovariateWithoutOpType, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate } from '../common/generic-types';
import { Covariate } from './covariate';
import { DerivedField } from './derived-field';

export interface NonInteractionCovariateWithoutOpType extends GenericNonInteractionCovariateWithoutOpType<Covariate, DerivedField> {}

export interface CategoricalNonInteractionCovariate extends GenericCategoricalNonInteractionCovariate<Covariate, DerivedField> {}

export interface ContinuousNonInteractionCovariate extends GenericContinuousNonInteractionCovariate<Covariate, DerivedField> {}

export type NonInteractionCovariate = NonInteractionCovariateWithoutOpType | CategoricalNonInteractionCovariate | ContinuousNonInteractionCovariate;