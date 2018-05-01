import { ICoxJson } from '../cox';
import { ILogisticRegressionJson } from '../logistic-regression';
import { RegressionAlgorithmTypes } from './regression-algorithm-types';
import { parseCovariateJsonToCovariate } from '../../parsers/json/json-covariate';
import {
    parseUserFunctions,
    IAlgorithmJson,
} from '../algorithm/algorithm-json';
import { IRegressionAlgorithmJson } from './regression-algorithm-json';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { getBinsLookupFromBinsLookupJson } from '../cox/bins/bins';

export type RegressionAlgorithmJsonTypes = ICoxJson | ILogisticRegressionJson;

export function parseRegressionAlgorithmJson(
    regressionAlgorithmJson: RegressionAlgorithmJsonTypes,
): RegressionAlgorithmTypes {
    const {
        derivedFields,
        ...coxJsonWithoutDerivedFields,
    } = regressionAlgorithmJson;

    const regressionAlgorithm = {
        ...coxJsonWithoutDerivedFields,
        covariates: regressionAlgorithmJson.covariates.map(covariateJson => {
            return parseCovariateJsonToCovariate(
                covariateJson,
                regressionAlgorithmJson.covariates,
                derivedFields,
            );
        }),
        userFunctions: parseUserFunctions(
            regressionAlgorithmJson.userFunctions,
        ),
    };

    if (regressionAlgorithmJson.algorithmType === AlgorithmType.Cox) {
        return Object.assign({}, regressionAlgorithm, {
            binsLookup: regressionAlgorithmJson.binsLookup
                ? getBinsLookupFromBinsLookupJson(
                      regressionAlgorithmJson.binsLookup,
                  )
                : undefined,
        });
    } else {
        return regressionAlgorithm;
    }
}

export function isRegressionAlgorithmJson(
    algorithm: IAlgorithmJson<any>,
): algorithm is IRegressionAlgorithmJson<
    AlgorithmType.Cox | AlgorithmType.LogisticRegression
> {
    return (
        algorithm.algorithmType === AlgorithmType.Cox ||
        algorithm.algorithmType === AlgorithmType.LogisticRegression
    );
}
