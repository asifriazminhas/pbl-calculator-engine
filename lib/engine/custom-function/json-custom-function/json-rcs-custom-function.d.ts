import { GenericRcsCustomFunction } from '../generic-custom-function';
import { RcsCustomFunction } from '../../custom-function';
import { CovariateJson } from '../../covariate';
import { DerivedFieldJson } from '../../derived-field';
import { RcsCustomFunctionJson } from '../../custom-function';
export declare type RcsCustomFunctionJson = GenericRcsCustomFunction<string>;
export declare function parseRcsCustomFunctionJsonToRcsCustomFunction(rcsCustomFunctionJson: RcsCustomFunctionJson, covariateJsons: CovariateJson[], derivedFieldJsons: DerivedFieldJson[]): RcsCustomFunction;
