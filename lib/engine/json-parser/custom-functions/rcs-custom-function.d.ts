import { RcsCustomFunctionJson, CovariateJson } from '../../common/json-types';
import { RcsCustomFunction } from '../../cox/custom-functions/rcs-custom-function';
import { DerivedFieldJson } from '../../common/json-types';
export declare function parseRcsCustomFunctionJsonToRcsCustomFunction(rcsCustomFunctionJson: RcsCustomFunctionJson, covariateJsons: Array<CovariateJson>, derivedFieldJsons: Array<DerivedFieldJson>): RcsCustomFunction;
