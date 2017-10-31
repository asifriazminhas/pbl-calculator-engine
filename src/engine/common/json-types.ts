import { GenericRcsCustomFunction, GenericCustomFunctions, GenericBaseCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate, GenericNonInteractionCovariate, GenericNonInteractionCovariateWithoutOpType, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate, GenericInteractionCovariate, GenericInteractionCovariateWithoutOpType, GenericCovariate, GenericCox } from './generic-types';
import { DataField } from '../data-field';
import { GenericDerivedField } from '../derived-field';

export type DerivedFromJson = string | DataField;

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
