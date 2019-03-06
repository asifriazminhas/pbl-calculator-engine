import { JsonSerializable } from '../../util/types';
import { Covariate } from '../../engine/data-field/covariate/covariate';
import {
    IRcsCustomFunctionJson,
    parseRcsCustomFunctionJsonToRcsCustomFunction,
} from './json-rcs-custom-function';
import { Omit } from 'utility-types';
import {
    parseDerivedFieldJsonToDerivedField,
    IDerivedFieldJson,
    findDerivedFieldJsonWithName,
} from './json-derived-field';
import { DataFieldType } from './data-field-type';
import { InteractionCovariate } from '../../engine/data-field/covariate/interaction-covariate/interaction-covariate';
/* tslint:disable-next-line */
import { NonInteractionCovariate } from '../../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate';
import { JsonInterval } from './json-interval';

export interface ICovariateJson
    extends Omit<JsonSerializable<Covariate>, 'customFunction' | 'intervals'> {
    dataFieldType:
        | DataFieldType.InteractionCovariate
        | DataFieldType.NonInteractionCovariate;
    customFunction?: IRcsCustomFunctionJson;
    intervals?: JsonInterval[];
}

export function findCovariateJsonWithName(
    covariateJsons: ICovariateJson[],
    name: string,
): ICovariateJson | undefined {
    return covariateJsons.find(covariateJson => covariateJson.name === name);
}

export function parseCovariateJsonToCovariate(
    covariateJson: ICovariateJson,
    covariateJsons: ICovariateJson[],
    derivedFieldJsons: IDerivedFieldJson[],
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
        ? parseRcsCustomFunctionJsonToRcsCustomFunction(
              covariateJson.customFunction,
              covariateJsons,
              derivedFieldJsons,
          )
        : undefined;

    if (covariateJson.dataFieldType === DataFieldType.InteractionCovariate) {
        if (!parsedDerivedField) {
            throw new Error(
                `No derived field found for interaction covariate ${covariateJson.name}`,
            );
        } else {
            return new InteractionCovariate(
                covariateJson,
                parsedCustomFunction,
                parsedDerivedField,
            );
        }
    } else {
        return new NonInteractionCovariate(
            covariateJson,
            parsedCustomFunction,
            parsedDerivedField,
        );
    }
}
