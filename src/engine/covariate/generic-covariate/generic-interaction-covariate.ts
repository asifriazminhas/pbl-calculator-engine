import { GenericBaseInteractionCovariate } from './generic-base-interaction-covariate';
import { GenericCategoricalInteractionCovariate } from './generic-categorical-interaction-covariate';
import { GenericContinuousInteractionCovariate } from './generic-continuous-interaction-covariate';

export type GenericInteractionCovariate<T> =
    | GenericBaseInteractionCovariate<T>
    | GenericCategoricalInteractionCovariate<T>
    | GenericContinuousInteractionCovariate<T>;
