import { Omit } from 'utility-types';
import { JsonSerializable } from '../../util/types';
import { RcsCustomFunction } from '../../engine/data-field/covariate/custom-function/rcs-custom-function';
import {
    ICovariateJson,
    findCovariateJsonWithName,
    parseCovariateJsonToCovariate,
} from './json-covariate';
import { IDerivedFieldJson } from './json-derived-field';

export interface IRcsCustomFunctionJson
    extends Omit<
            JsonSerializable<RcsCustomFunction>,
            'firstVariableCovariate'
        > {
    firstVariableCovariate: string;
}

export function parseRcsCustomFunctionJsonToRcsCustomFunction(
    rcsCustomFunctionJson: IRcsCustomFunctionJson,
    covariateJsons: ICovariateJson[],
    derivedFieldJsons: IDerivedFieldJson[],
): RcsCustomFunction {
    const firstVariableCovariate = findCovariateJsonWithName(
        covariateJsons,
        rcsCustomFunctionJson.firstVariableCovariate,
    );

    if (!firstVariableCovariate) {
        throw new Error(
            `No first variable covariate ${rcsCustomFunctionJson.firstVariableCovariate} found`,
        );
    }

    return new RcsCustomFunction(
        rcsCustomFunctionJson,
        parseCovariateJsonToCovariate(
            firstVariableCovariate,
            covariateJsons,
            derivedFieldJsons,
        ),
    );
}
