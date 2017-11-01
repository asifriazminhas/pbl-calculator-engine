import { ICoxJson } from '../cox-json';
import { Cox } from '../cox/cox';
import { parseCovariateJsonToCovariate } from './covariate';

function parseUserFunctions(
    userFunctionsJson: ICoxJson['userFunctions']
): Cox['userFunctions'] {
    let userFunctions: Cox['userFunctions'] = {}

    Object.keys(userFunctionsJson)
        .forEach((userFunctionJsonKey) => {
            eval(userFunctionsJson[userFunctionJsonKey]);
        });

    return userFunctions;
}

export function parseCoxJsonToCox(
    coxJson: ICoxJson
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
            userFunctions: parseUserFunctions(
                coxJson.userFunctions
            )
        }
    )
}