import { RcsCustomFunction } from '../../cox/custom-functions/rcs-custom-function';
import { parseCovariateJsonToCovariate, findCovariateJsonWithName } from '../covariate';
import { CovariateJson } from '../json-types';
import { DerivedFieldJson } from '../../derived-field';
import { RcsCustomFunctionJson } from '../../custom-function';

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