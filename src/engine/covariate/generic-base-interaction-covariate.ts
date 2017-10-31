import { GenericBaseCovariate } from './generic-base-covariate';
import { FieldType } from '../field';

export interface GenericBaseInteractionCovariate<T> extends GenericBaseCovariate<T> {
    fieldType: FieldType.InteractionCovariate;
}