import { CustomFunction } from '../../cox/custom-functions/custom-function';
import { CustomFunctionsJson, CovariateJson, DerivedFieldJson } from '../../common/json-types';
export declare function parseCustomFunctionJsonToCustomFunction(customFunctionJson: CustomFunctionsJson, covariateJsons: Array<CovariateJson>, derivedFieldJsons: Array<DerivedFieldJson>): CustomFunction;
