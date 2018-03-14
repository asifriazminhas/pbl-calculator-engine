import { GenericCovariate } from '../generic-covariate';
import { DerivedFieldJson } from '../../derived-field';
import { Covariate } from '../covariate';
import { InteractionCovariate } from '../interaction-covariate';
import {
    findDerivedFieldJsonWithName,
    parseDerivedFieldJsonToDerivedField,
} from '../../derived-field';
import { FieldType } from '../../field';
import { parseCustomFunctionJsonToCustomFunction } from '../../custom-function';

export type CovariateJson = GenericCovariate<string>;

export function findCovariateJsonWithName(
    covariateJsons: CovariateJson[],
    name: string,
): CovariateJson | undefined {
    return covariateJsons.find(covariateJson => covariateJson.name === name);
}

export function parseCovariateJsonToCovariate(
    covariateJson: CovariateJson,
    covariateJsons: CovariateJson[],
    derivedFieldJsons: DerivedFieldJson[],
): Covariate {
    const derivedFieldJsonForCovariateJson = findDerivedFieldJsonWithName(
        derivedFieldJsons,
        covariateJson.name,
    );
    const parsedDerivedField = derivedFieldJsonForCovariateJson
        ? parseDerivedFieldJsonToDerivedField(
              derivedFieldJsonForCovariateJson,
              derivedFieldJsons,
              covariateJsons,
          )
        : undefined;
    const parsedCustomFunction = covariateJson.customFunction
        ? parseCustomFunctionJsonToCustomFunction(
              covariateJson.customFunction,
              covariateJsons,
              derivedFieldJsons,
          )
        : undefined;

    if (covariateJson.fieldType === FieldType.InteractionCovariate) {
        if (!parsedDerivedField) {
            throw new Error(
                `No derived field found for interaction covariate ${covariateJson.name}`,
            );
        } else {
            return Object.assign({}, covariateJson, {
                derivedField: parsedDerivedField,
                customFunction: parsedCustomFunction,
            }) as InteractionCovariate;
        }
    } else {
        return Object.assign({}, covariateJson, {
            derivedField: parsedDerivedField,
            customFunction: parsedCustomFunction,
        });
    }
}
