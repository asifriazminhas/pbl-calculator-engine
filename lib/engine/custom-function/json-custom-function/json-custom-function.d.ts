import { GenericCustomFunction } from '../generic-custom-function';
import { CustomFunction } from '../../custom-function';
import { CovariateJson } from '../../covariate';
import { DerivedFieldJson } from '../../derived-field';
import { CustomFunctionsJson } from '../../custom-function';
export declare type CustomFunctionsJson = GenericCustomFunction<string>;
export declare function parseCustomFunctionJsonToCustomFunction(customFunctionJson: CustomFunctionsJson, covariateJsons: CovariateJson[], derivedFieldJsons: DerivedFieldJson[]): CustomFunction;
