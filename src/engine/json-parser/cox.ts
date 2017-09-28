import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { parseCovariateJsonToCovariate } from './covariate';

function parseUserFunctions(
    userFunctionsJson: CoxJson['userFunctions']
): Cox['userFunctions'] {
    let userFunctions: Cox['userFunctions'] = {}

    Object.keys(userFunctionsJson)
        .forEach((userFunctionJsonKey) => {
            eval(userFunctionsJson[userFunctionJsonKey]);
        });

    return userFunctions;
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
            userFunctions: parseUserFunctions(
                coxJson.userFunctions
            )
        }
    )
}