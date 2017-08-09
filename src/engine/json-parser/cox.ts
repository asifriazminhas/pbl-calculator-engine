import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { parseCovariateJsonToCovariate } from './covariate';

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
            })
        }
    )
}