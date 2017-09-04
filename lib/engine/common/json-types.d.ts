import { GenericDerivedField, GenericCategoricalDerivedField, GenericContinuousDerivedField, GenericDerivedFieldWithoutOpType, GenericRcsCustomFunction, GenericCustomFunctions, GenericBaseCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate, GenericNonInteractionCovariate, GenericNonInteractionCovariateWithoutOpType, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate, GenericInteractionCovariate, GenericInteractionCovariateWithoutOpType, GenericCovariate, GenericDataField, GenericCox } from './generic-types';
export declare type DerivedFromJson = string | GenericDataField;
export declare type CategoricalDerivedFieldJson = GenericCategoricalDerivedField<DerivedFromJson>;
export declare type ContinuousDerivedFieldJson = GenericContinuousDerivedField<DerivedFromJson>;
export declare type DerivedFieldWithoutOpTypeJson = GenericDerivedFieldWithoutOpType<DerivedFromJson>;
export declare type DerivedFieldJson = GenericDerivedField<DerivedFromJson>;
export declare type RcsCustomFunctionJson = GenericRcsCustomFunction<string>;
export declare type CustomFunctionsJson = GenericCustomFunctions<string>;
export declare type BaseCovariateJson = GenericBaseCovariate<string>;
export declare type CategoricalNonInteractionCovariateJson = GenericCategoricalNonInteractionCovariate<string>;
export declare type ContinuousNonInteractionCovariateJson = GenericContinuousNonInteractionCovariate<string>;
export declare type NonInteractionCovariateJson = GenericNonInteractionCovariate<string>;
export declare type NonInteractionCovariateWithoutOpTypeJson = GenericNonInteractionCovariateWithoutOpType<string>;
export declare type CategoricalInteractionCovariateJson = GenericCategoricalInteractionCovariate<string>;
export declare type ContinuousInteractionCovariateJson = GenericContinuousInteractionCovariate<string>;
export declare type InteractionCovariateJson = GenericInteractionCovariate<string>;
export declare type InteractionCovariateWithoutOpTypeJson = GenericInteractionCovariateWithoutOpType<string>;
export declare type CovariateJson = GenericCovariate<string>;
export interface CoxJson extends GenericCox<CovariateJson> {
    derivedFields: Array<DerivedFieldJson>;
    causeDeletedRef: any;
}
