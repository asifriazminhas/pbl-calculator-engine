export type Constructor<T> = new(...args: any[]) => T;

/**
 * 
 * 
 * @export
 * @interface GenericDerivedField
 * @extends {GenericDataField}
 * @template T Value of the items in the derivedFrom field
 */
export interface GenericDerivedField<T> extends GenericDataField {
    equation: string;
    derivedFrom: Array<T>;
}

/**
 * 
 * 
 * @export
 * @interface GenericCustomFunction
 */
export interface GenericCustomFunction {}

/**
 * 
 * 
 * @export
 * @interface GenericRcsCustomFunction
 * @extends {GenericCustomFunction}
 * @template T The value of the firstVariableCovariate field
 */
export interface GenericRcsCustomFunction<T> extends GenericCustomFunction {
    knots: Array<number>;
    firstVariableCovariate: T;
    variableNumber: number;
}

/**
 * 
 * 
 * @export
 * @interface GenericCovariate
 * @extends {GenericDataField}
 */
export interface GenericCovariate extends GenericDataField {
    beta: number;
    referencePoint: number;
    customFunction: GenericCustomFunction | null;
}

/**
 * 
 * 
 * @export
 * @interface GenericAlgorithm
 * @template T Type of item in the derivedFrom array for each DerivedField in the localTransformations field
 */
export interface GenericAlgorithm<T> {
    name: string;
    version: string;
    description: string;
    baselineHazard: number;
    covariates: Array<GenericCovariate>;
    localTransformations: Array<GenericDerivedField<T>>;
}

export interface GenericCategory {
    value: string;
    displayValue: string;
    description: string;
}

export interface GenericCategoricalField {
    categories: Array<GenericCategory>;
}

export interface GenericContinuousField {
    minValue: number;
    maxValue: number;
}

/**
 *
 * 
 * @export
 * @interface GenericDataField
 */
export interface GenericDataField {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    };
}

export interface GenericContinuousDataField extends GenericDataField, GenericContinuousField {}
export interface GenericCategoricalDataField extends GenericDataField, GenericCategoricalField {}
export type GenericDataFields = GenericDataField | GenericCategoricalDataField | GenericContinuousDataField;