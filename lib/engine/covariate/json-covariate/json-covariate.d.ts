import { GenericCovariate } from '../generic-covariate';
import { DerivedFieldJson } from '../../derived-field';
import { Covariate } from '../covariate';
export declare type CovariateJson = GenericCovariate<string>;
export declare function findCovariateJsonWithName(covariateJsons: CovariateJson[], name: string): CovariateJson | undefined;
export declare function parseCovariateJsonToCovariate(covariateJson: CovariateJson, covariateJsons: CovariateJson[], derivedFieldJsons: DerivedFieldJson[]): Covariate;
