import { parseRcsCustomFunctionJsonToRcsCustomFunction } from './rcs-custom-function';
import { CustomFunctionType } from '../../custom-function';
import { CustomFunction } from '../../cox/custom-functions/custom-function';
import { CustomFunctionsJson, CovariateJson, DerivedFieldJson } from '../../common/json-types';

export function parseCustomFunctionJsonToCustomFunction(
    customFunctionJson: CustomFunctionsJson,
    covariateJsons: Array<CovariateJson>,
    derivedFieldJsons: Array<DerivedFieldJson>
): CustomFunction {
    if (customFunctionJson.customFunctionType === CustomFunctionType.RcsCustomFunction) {
        return parseRcsCustomFunctionJsonToRcsCustomFunction(
            customFunctionJson,
            covariateJsons,
            derivedFieldJsons
        );
    }
    else {
        throw new Error(`Unknown custom function type`);
    }
}