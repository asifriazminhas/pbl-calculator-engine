import { GenericDerivedField, GenericCategoricalDerivedField, GenericContinuousDerivedField, GenericDerivedFieldWithoutOpType, GenericRcsCustomFunction, GenericCustomFunctions, GenericBaseCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate, GenericNonInteractionCovariate, GenericNonInteractionCovariateWithoutOpType, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate, GenericInteractionCovariate, GenericInteractionCovariateWithoutOpType, GenericCovariate, GenericDataField, GenericCox } from './generic-types';

export type DerivedFromJson = string | GenericDataField;

export type CategoricalDerivedFieldJson = GenericCategoricalDerivedField<DerivedFromJson>;
export type ContinuousDerivedFieldJson = GenericContinuousDerivedField<DerivedFromJson>;
export type DerivedFieldWithoutOpTypeJson = GenericDerivedFieldWithoutOpType<DerivedFromJson>;
export type DerivedFieldJson = GenericDerivedField<DerivedFromJson>;

export type RcsCustomFunctionJson = GenericRcsCustomFunction<string>;
export type CustomFunctionsJson = GenericCustomFunctions<string>;

export type BaseCovariateJson = GenericBaseCovariate<string>;

export type CategoricalNonInteractionCovariateJson = GenericCategoricalNonInteractionCovariate<string>;
export type ContinuousNonInteractionCovariateJson = GenericContinuousNonInteractionCovariate<string>;
export type NonInteractionCovariateJson = GenericNonInteractionCovariate<string>;
export type NonInteractionCovariateWithoutOpTypeJson = GenericNonInteractionCovariateWithoutOpType<string>;

export type CategoricalInteractionCovariateJson = GenericCategoricalInteractionCovariate<string>;
export type ContinuousInteractionCovariateJson = GenericContinuousInteractionCovariate<string>;
export type InteractionCovariateJson = GenericInteractionCovariate<string>;
export type InteractionCovariateWithoutOpTypeJson = GenericInteractionCovariateWithoutOpType<string>;

export type CovariateJson = GenericCovariate<string>;

export interface CoxJson extends GenericCox<CovariateJson, string> {
    derivedFields: Array<DerivedFieldJson>;
    //TODO Implement this
    causeDeletedRef: any;
}
