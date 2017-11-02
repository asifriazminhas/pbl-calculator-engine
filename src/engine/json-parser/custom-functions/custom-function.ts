import { parseRcsCustomFunctionJsonToRcsCustomFunction } from './rcs-custom-function';
import { CustomFunctionType } from '../../custom-function';
import { CustomFunction } from '../../custom-function';
import { CovariateJson } from '../../covariate';
import { DerivedFieldJson } from '../../derived-field';
import { CustomFunctionsJson } from '../../custom-function';

export function parseCustomFunctionJsonToCustomFunction(
    customFunctionJson: CustomFunctionsJson,
    covariateJsons: Array<CovariateJson>,
    derivedFieldJsons: Array<DerivedFieldJson>,
): CustomFunction {
    if (
        customFunctionJson.customFunctionType ===
        CustomFunctionType.RcsCustomFunction
    ) {
        return parseRcsCustomFunctionJsonToRcsCustomFunction(
            customFunctionJson,
            covariateJsons,
            derivedFieldJsons,
        );
    } else {
        throw new Error(`Unknown custom function type`);
    }
}
