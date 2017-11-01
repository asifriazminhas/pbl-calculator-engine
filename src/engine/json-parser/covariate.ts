import { CovariateJson } from './json-types';
import { DerivedFieldJson } from '../derived-field';
import { Covariate } from '../cox/covariate';
import { findDerivedFieldJsonWithName, parseDerivedFieldJsonToDerivedField } from './derived-field';
import { FieldType } from '../field';
import { InteractionCovariate } from '../cox/interaction-covariate';
import { parseCustomFunctionJsonToCustomFunction } from './custom-functions/custom-function';

export function findCovariateJsonWithName(
    covariateJsons: Array<CovariateJson>,
    name: string
): CovariateJson | undefined {
    return covariateJsons
        .find(covariateJson => covariateJson.name === name);
}

export function parseCovariateJsonToCovariate(
    covariateJson: CovariateJson,
    covariateJsons: Array<CovariateJson>,
    derivedFieldJsons: Array<DerivedFieldJson>
): Covariate {
    const derivedFieldJsonForCovariateJson = findDerivedFieldJsonWithName(
        derivedFieldJsons,
        covariateJson.name
    );
    const parsedDerivedField = derivedFieldJsonForCovariateJson ? parseDerivedFieldJsonToDerivedField(
        derivedFieldJsonForCovariateJson,
        derivedFieldJsons,
        covariateJsons
    ) : undefined;
    const parsedCustomFunction = covariateJson.customFunction ? parseCustomFunctionJsonToCustomFunction(
        covariateJson.customFunction,
        covariateJsons,
        derivedFieldJsons
    ) : undefined;

    if (covariateJson.fieldType === FieldType.InteractionCovariate) {
        if (!parsedDerivedField) {
            throw new Error();
        }
        else {
            return Object.assign(
                {},
                covariateJson,
                {
                    derivedField: parsedDerivedField,
                    customFunction: parsedCustomFunction
                }
            ) as InteractionCovariate;
        }
    }
    else {
        return Object.assign(
            {},
            covariateJson,
            {
                derivedField: parsedDerivedField,
                customFunction: parsedCustomFunction
            }
        );
    }
}