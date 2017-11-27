import { IGenericAlgorithm } from './generic-algorithm';
import { CovariateJson } from '../covariate';
import { DerivedFieldJson } from '../derived-field';
import { IAlgorithmJson } from './algorithm-json';
import { Algorithm } from './algorithm';
import { parseCovariateJsonToCovariate } from '../covariate';

export interface IAlgorithmJson
    extends IGenericAlgorithm<CovariateJson, string, number> {
    derivedFields: DerivedFieldJson[];
}

export function parseUserFunctions(
    userFunctionsJson: IAlgorithmJson['userFunctions'],
): Algorithm['userFunctions'] {
    // tslint:disable-next-line
    let userFunctions: Algorithm['userFunctions'] = {};

    Object.keys(userFunctionsJson).forEach(userFunctionJsonKey => {
        eval(userFunctionsJson[userFunctionJsonKey]);
    });

    return userFunctions;
}

export function parseAlgorithmJson(coxJson: IAlgorithmJson): Algorithm {
    const { derivedFields, ...coxJsonWithoutDerivedFields } = coxJson;

    return {
        ...coxJsonWithoutDerivedFields,
        covariates: coxJson.covariates.map(covariateJson => {
            return parseCovariateJsonToCovariate(
                covariateJson,
                coxJson.covariates,
                derivedFields,
            );
        }),
        userFunctions: parseUserFunctions(coxJson.userFunctions),
    };
}
