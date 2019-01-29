// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { JsonSerializable } from '../../util/types';
import { Omit } from 'utility-types';
import { ICovariateJson } from './json-covariate';
import { IDerivedFieldJson } from './json-derived-field';
import { IUserFunctionsJson } from './json-user-functions';
import { BaselineJson } from './json-baseline';
import { IBinsJson } from './json-bins';

export interface ICoxSurvivalAlgorithmJson
    extends Omit<
            JsonSerializable<CoxSurvivalAlgorithm>,
            'covariates' | 'userFunctions' | 'baseline' | 'bins' | 'calibration'
        > {
    covariates: ICovariateJson[];
    derivedFields: IDerivedFieldJson[];
    userFunctions: IUserFunctionsJson;
    baseline: BaselineJson;
    bins?: IBinsJson;
}

export function parseCoxSurvivalAlgorithmJson(
    coxSurvivalAlgorithmJson: ICoxSurvivalAlgorithmJson,
): CoxSurvivalAlgorithm {
    return new CoxSurvivalAlgorithm(coxSurvivalAlgorithmJson);
}
