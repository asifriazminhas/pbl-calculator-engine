import { GenericCox } from '../generic-cox';
import { GenericCustomFunction, GenericRcsCustomFunction } from '../custom-function';
import { GenericBaseCovariate, GenericCategoricalNonInteractionCovariate, GenericContinuousNonInteractionCovariate, GenericNonInteractionCovariate, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate, GenericInteractionCovariate, GenericBaseInteractionCovariate, GenericBaseNonInteractionCovariate, GenericCovariate } from '../covariate';
import { DerivedFieldJson } from '../derived-field';

export type RcsCustomFunctionJson = GenericRcsCustomFunction<string>;
export type CustomFunctionsJson = GenericCustomFunction<string>;

export type BaseCovariateJson = GenericBaseCovariate<string>;

export type CategoricalNonInteractionCovariateJson = GenericCategoricalNonInteractionCovariate<string>;
export type ContinuousNonInteractionCovariateJson = GenericContinuousNonInteractionCovariate<string>;
export type NonInteractionCovariateJson = GenericNonInteractionCovariate<string>;
export type NonInteractionCovariateWithoutOpTypeJson = GenericBaseNonInteractionCovariate<string>;

export type CategoricalInteractionCovariateJson = GenericCategoricalInteractionCovariate<string>;
export type ContinuousInteractionCovariateJson = GenericContinuousInteractionCovariate<string>;
export type InteractionCovariateJson = GenericInteractionCovariate<string>;
export type InteractionCovariateWithoutOpTypeJson = GenericBaseInteractionCovariate<string>;

export type CovariateJson = GenericCovariate<string>;

export interface CoxJson extends GenericCox<CovariateJson, string> {
    derivedFields: Array<DerivedFieldJson>;
    //TODO Implement this
    causeDeletedRef: any;
}
