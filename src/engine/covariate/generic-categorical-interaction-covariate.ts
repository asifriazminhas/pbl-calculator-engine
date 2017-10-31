import { GenericBaseInteractionCovariate } from './generic-base-interaction-covariate';
import { CategoricalOpType } from '../op-type';

export interface GenericCategoricalInteractionCovariate<T> extends GenericBaseInteractionCovariate<T>, CategoricalOpType {

}