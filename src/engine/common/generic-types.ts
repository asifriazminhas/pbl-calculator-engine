import { FieldTypes } from './field-types';
import { OpTypes } from './op-types';
import { CustomFunctionTypes } from './custom-function-types';

export interface GenericField {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    };
}

export interface GenericCategory {
    value: string;
    displayValue: string;
    description: string;
}
export interface GenericCategoricalOpType {
    opType: OpTypes.Categorical;
    categories:Array<GenericCategory>;
}

export interface GenericContinuousOpType {
    opType: OpTypes.Continuous;
    min: number;
    max: number;
}

export interface GenericDataFieldWithoutOpType extends GenericField {
    fieldType: FieldTypes.DataField;
}
export interface GenericCategoricalDataField extends GenericDataFieldWithoutOpType, GenericCategoricalOpType {}
export interface GenericContinuousDataField extends GenericDataFieldWithoutOpType, GenericContinuousOpType {}
export type GenericDataField = GenericDataFieldWithoutOpType | GenericCategoricalDataField | GenericContinuousDataField;

export interface GenericDerivedFieldWithoutOpType<T> extends GenericField {
    fieldType: FieldTypes.DerivedField;
    equation: string;
    derivedFrom: Array<T>;
}
export interface GenericCategoricalDerivedField<T> extends GenericDerivedFieldWithoutOpType<T>, GenericCategoricalOpType { }
export interface GenericContinuousDerivedField<T> extends GenericDerivedFieldWithoutOpType<T>, GenericContinuousOpType { }
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
    fieldType: FieldTypes.NonInteractionCovariate;
}
export interface GenericCategoricalNonInteractionCovariate<T> extends GenericNonInteractionCovariateWithoutOpType<T>, GenericCategoricalOpType {}
export interface GenericContinuousNonInteractionCovariate<T> extends GenericNonInteractionCovariateWithoutOpType<T>, GenericContinuousOpType {}
export type GenericNonInteractionCovariate<T> = GenericNonInteractionCovariateWithoutOpType<T> | GenericCategoricalNonInteractionCovariate<T> | GenericContinuousNonInteractionCovariate<T>;

export interface GenericInteractionCovariateWithoutOpType<T> extends GenericBaseCovariate<T> {
    fieldType: FieldTypes.InteractionCovariate;
}
export interface GenericCategoricalInteractionCovariate<T> extends GenericInteractionCovariateWithoutOpType<T>, GenericCategoricalOpType {}
export interface GenericContinuousInteractionCovariate<T> extends GenericInteractionCovariateWithoutOpType<T>, GenericContinuousOpType {}
export type GenericInteractionCovariate<T> = GenericInteractionCovariateWithoutOpType<T> | GenericCategoricalInteractionCovariate<T> | GenericContinuousInteractionCovariate<T>;

export type GenericCovariate<T> = GenericInteractionCovariate<T> | GenericNonInteractionCovariate<T>;

export interface GenericCox<T, U> {
    name: string;
    version: string;
    description: string;
    covariates: Array<T>;
    derivedFields: Array<U>;
    baselineHazard: number;
}





