import { CovariateJson } from '../common/json-types';
import { Covariate } from '../cox/covariate';
import { DerivedFieldJson } from '../common/json-types';
export declare function findCovariateJsonWithName(covariateJsons: Array<CovariateJson>, name: string): CovariateJson | undefined;
export declare function parseCovariateJsonToCovariate(covariateJson: CovariateJson, covariateJsons: Array<CovariateJson>, derivedFieldJsons: Array<DerivedFieldJson>): Covariate;
