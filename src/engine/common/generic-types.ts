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

export interface GenericBaseCovariate<T, U> extends GenericField {
    beta: number;
    referencePoint: number;
    customFunction: GenericCustomFunctions<T> | undefined;
    derivedField: U | undefined;
}
export interface GenericNonInteractionCovariateWithoutOpType<T, U> extends GenericBaseCovariate<T, U> {
    fieldType: FieldTypes.NonInteractionCovariate;
}
export interface GenericCategoricalNonInteractionCovariate<T, U> extends GenericNonInteractionCovariateWithoutOpType<T, U>, GenericCategoricalOpType {}
export interface GenericContinuousNonInteractionCovariate<T, U> extends GenericNonInteractionCovariateWithoutOpType<T, U>, GenericContinuousOpType {}
export type GenericNonInteractionCovariate<T, U> = GenericNonInteractionCovariateWithoutOpType<T, U> | GenericCategoricalNonInteractionCovariate<T, U> | GenericContinuousNonInteractionCovariate<T, U>;

export interface GenericInteractionCovariateWithoutOpType<T, U> extends GenericBaseCovariate<T, U> {
    fieldType: FieldTypes.InteractionCovariate;
    derivedField: U;
}
export interface GenericCategoricalInteractionCovariate<T, U> extends GenericInteractionCovariateWithoutOpType<T, U>, GenericCategoricalOpType {}
export interface GenericContinuousInteractionCovariate<T, U> extends GenericInteractionCovariateWithoutOpType<T, U>, GenericContinuousOpType {}
export type GenericInteractionCovariate<T, U> = GenericInteractionCovariateWithoutOpType<T, U> | GenericCategoricalInteractionCovariate<T, U> | GenericContinuousInteractionCovariate<T, U>;

export type GenericCovariate<T, U> = GenericInteractionCovariate<T, U> | GenericNonInteractionCovariate<T, U>;





