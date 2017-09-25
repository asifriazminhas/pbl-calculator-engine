import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { parseCovariateJsonToCovariate } from './covariate';

function parseUserDefinedFunctions(
    userDefinedFunctionsJson: CoxJson['userDefinedFunctions']
): Cox['userDefinedFunctions'] {
    let userDefinedFunctions: Cox['userDefinedFunctions'] = {}

    Object.keys(userDefinedFunctionsJson)
        .forEach((userDefinedFunctionJsonKey) => {
            eval(userDefinedFunctionsJson[userDefinedFunctionJsonKey]);
        });

    return userDefinedFunctions;
}

export function parseCoxJsonToCox(
    coxJson: CoxJson
): Cox {
    return Object.assign(
        {},
        coxJson,
        {
            covariates: coxJson.covariates.map((covariateJson) => {
                return parseCovariateJsonToCovariate(
                    covariateJson,
                    coxJson.covariates,
                    coxJson.derivedFields
                )
            }),
            userDefinedFunctions: parseUserDefinedFunctions(
                coxJson.userDefinedFunctions
            )
        }
    )
}