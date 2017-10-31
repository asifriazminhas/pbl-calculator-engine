import { GenericInteractionCovariate } from './generic-interaction-covariate';
import { GenericNonInteractionCovariate } from './generic-non-interaction-covariate';

export type GenericCovariate<T> = GenericInteractionCovariate<T> | GenericNonInteractionCovariate<T>;