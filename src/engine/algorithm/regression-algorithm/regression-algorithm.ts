import { Algorithm } from '../algorithm';
import { Covariate } from '../../data-field/covariate/covariate';
import { Data } from '../../data/data';
import { add } from 'lodash';
import { ICoxSurvivalAlgorithmJson } from '../../../parsers/json/json-cox-survival-algorithm';
import { parseCovariateJsonToCovariate } from '../../../parsers/json/json-covariate';

export abstract class RegressionAlgorithm extends Algorithm {
    covariates: Covariate[];

    constructor(regressionAlgorithmJson: ICoxSurvivalAlgorithmJson) {
        super(regressionAlgorithmJson);

        this.covariates = regressionAlgorithmJson.covariates.map(
            covariateJson => {
                return parseCovariateJsonToCovariate(
                    covariateJson,
                    regressionAlgorithmJson.covariates,
                    regressionAlgorithmJson.derivedFields,
                );
            },
        );
    }

    calculateScore(data: Data): number {
        return this.covariates
            .map(covariate =>
                covariate.getComponent(data, this.userFunctions, this.tables),
            )
            .reduce(add, 0);
    }
}
