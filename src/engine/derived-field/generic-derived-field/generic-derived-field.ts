import { GenericBaseDerivedField } from './generic-base-derived-field';
import { GenericCategoricalDerivedField } from './generic-categorical-derived-field';
import { GenericContinuousDerivedField } from './generic-continuous-derived-field';

export type GenericDerivedField<T> =
    | GenericBaseDerivedField<T>
    | GenericCategoricalDerivedField<T>
    | GenericContinuousDerivedField<T>;
