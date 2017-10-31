import { FieldType, Field } from '../field';
import { CategoricalOpType, ContinuousOpType } from '../op-type';
import { GenericCustomFunction } from '../custom-function';

export interface GenericBaseCovariate<T> extends Field {
    beta: number;
    referencePoint: number;
    customFunction: GenericCustomFunction<T> | undefined;
}
export interface GenericNonInteractionCovariateWithoutOpType<T> extends GenericBaseCovariate<T> {
    fieldType: FieldType.NonInteractionCovariate;
}
export interface GenericCategoricalNonInteractionCovariate<T> extends GenericNonInteractionCovariateWithoutOpType<T>, CategoricalOpType {}
export interface GenericContinuousNonInteractionCovariate<T> extends GenericNonInteractionCovariateWithoutOpType<T>, ContinuousOpType {}
export type GenericNonInteractionCovariate<T> = GenericNonInteractionCovariateWithoutOpType<T> | GenericCategoricalNonInteractionCovariate<T> | GenericContinuousNonInteractionCovariate<T>;

export interface GenericInteractionCovariateWithoutOpType<T> extends GenericBaseCovariate<T> {
    fieldType: FieldType.InteractionCovariate;
}
export interface GenericCategoricalInteractionCovariate<T> extends GenericInteractionCovariateWithoutOpType<T>, CategoricalOpType {}
export interface GenericContinuousInteractionCovariate<T> extends GenericInteractionCovariateWithoutOpType<T>, ContinuousOpType {}
export type GenericInteractionCovariate<T> = GenericInteractionCovariateWithoutOpType<T> | GenericCategoricalInteractionCovariate<T> | GenericContinuousInteractionCovariate<T>;

export type GenericCovariate<T> = GenericInteractionCovariate<T> | GenericNonInteractionCovariate<T>;

export interface GenericCox<T, U> {
    name: string;
    version: string;
    description: string;
    covariates: Array<T>;
    baselineHazard: number;
    userFunctions: {
        [index: string]: U
    }
}





