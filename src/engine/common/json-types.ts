import { GenericDerivedField, GenericCategoricalDerivedField, GenericContinuousDerivedField, GenericDerivedFieldWithoutOpType, GenericRcsCustomFunction, GenericCustomFunctions, GenericBaseCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate, GenericNonInteractionCovariate, GenericNonInteractionCovariateWithoutOpType, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate, GenericInteractionCovariate, GenericInteractionCovariateWithoutOpType, GenericCovariate, GenericDataField, GenericCox } from './generic-types';

export type DerivedFrom = string | GenericDataField;

export type CategoricalDerivedFieldJson = GenericCategoricalDerivedField<DerivedFrom>;
export type ContinuousDerivedFieldJson = GenericContinuousDerivedField<DerivedFrom>;
export type DerivedFieldWithoutOpTypeJson = GenericDerivedFieldWithoutOpType<DerivedFrom>;
export type DerivedFieldJson = GenericDerivedField<DerivedFrom>;

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

export type CoxJson = GenericCox<CovariateJson, DerivedFieldJson>;
