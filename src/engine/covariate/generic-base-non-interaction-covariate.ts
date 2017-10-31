import { GenericBaseCovariate } from './generic-base-covariate';
import { FieldType } from '../field';

export interface GenericBaseNonInteractionCovariate<T> extends GenericBaseCovariate<T> {
    fieldType: FieldType.NonInteractionCovariate;
}