import { FieldType, GenericField } from '../field';
import { CategoricalOpType, ContinuousOpType } from '../op-type';
import { CustomFunctionTypes } from './custom-function-types';

export interface GenericDataFieldWithoutOpType extends GenericField {
    fieldType: FieldType.DataField;
}
export interface GenericCategoricalDataField extends GenericDataFieldWithoutOpType, CategoricalOpType {}
export interface GenericContinuousDataField extends GenericDataFieldWithoutOpType, ContinuousOpType {}
export type GenericDataField = GenericDataFieldWithoutOpType | GenericCategoricalDataField | GenericContinuousDataField;

export interface GenericDerivedFieldWithoutOpType<T> extends GenericField {
    fieldType: FieldType.DerivedField;
    equation: string;
    derivedFrom: Array<T>;
}
export interface GenericCategoricalDerivedField<T> extends GenericDerivedFieldWithoutOpType<T>, CategoricalOpType { }
export interface GenericContinuousDerivedField<T> extends GenericDerivedFieldWithoutOpType<T>, ContinuousOpType { }
export type GenericDerivedField<T> = GenericDerivedFieldWithoutOpType<T> | GenericCategoricalDerivedField<T> | GenericContinuousDerivedField<T>;

export interface GenericRcsCustomFunction<T> {
    customFunctionType: CustomFunctionTypes.RcsCustomFunction;
    knots: Array<number>;
    firstVariableCovariate: T;
    variableNumber: number;
}
export type GenericCustomFunctions<T> = GenericRcsCustomFunction<T>;

export interface GenericBaseCovariate<T> extends GenericField {
    beta: number;
    referencePoint: number;
    customFunction: GenericCustomFunctions<T> | undefined;
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





