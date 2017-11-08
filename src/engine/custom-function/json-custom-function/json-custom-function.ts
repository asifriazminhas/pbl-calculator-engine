import { GenericCustomFunction } from '../generic-custom-function';
import { parseRcsCustomFunctionJsonToRcsCustomFunction } from './json-rcs-custom-function';
import { CustomFunctionType } from '../../custom-function';
import { CustomFunction } from '../../custom-function';
import { CovariateJson } from '../../covariate';
import { DerivedFieldJson } from '../../derived-field';
import { CustomFunctionsJson } from '../../custom-function';

export type CustomFunctionsJson = GenericCustomFunction<string>;

export function parseCustomFunctionJsonToCustomFunction(
    customFunctionJson: CustomFunctionsJson,
    covariateJsons: CovariateJson[],
    derivedFieldJsons: DerivedFieldJson[],
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
