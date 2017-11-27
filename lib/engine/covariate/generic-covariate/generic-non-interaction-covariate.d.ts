import { GenericBaseNonInteractionCovariate } from './generic-base-non-interaction-covariate';
import { GenericCategoricalNonInteractionCovariate } from './generic-categorical-non-interaction-covariate';
import { GenericContinuousNonInteractionCovariate } from './generic-continuous-non-interaction-covariate';
export declare type GenericNonInteractionCovariate<T> = GenericBaseNonInteractionCovariate<T> | GenericCategoricalNonInteractionCovariate<T> | GenericContinuousNonInteractionCovariate<T>;
