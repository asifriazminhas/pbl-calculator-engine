import { RcsCustomFunctionJson, CovariateJson } from '../../common/json-types';
import { RcsCustomFunction } from '../../cox/custom-functions/rcs-custom-function';
import { parseCovariateJsonToCovariate, findCovariateJsonWithName } from '../covariate';
import { DerivedFieldJson } from '../../common/json-types';

export function parseRcsCustomFunctionJsonToRcsCustomFunction(
    rcsCustomFunctionJson: RcsCustomFunctionJson,
    covariateJsons: Array<CovariateJson>,
    derivedFieldJsons: Array<DerivedFieldJson>
): RcsCustomFunction {
    const firstVariableCovariate = findCovariateJsonWithName(
        covariateJsons,
        rcsCustomFunctionJson.firstVariableCovariate
    );

    if (!firstVariableCovariate) {
        throw new Error(``);
    }

    return Object.assign({}, rcsCustomFunctionJson, {
        firstVariableCovariate: parseCovariateJsonToCovariate(
            firstVariableCovariate,
            covariateJsons,
            derivedFieldJsons
        )
    });
}