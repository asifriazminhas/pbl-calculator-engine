import { IGenericAlgorithm } from './generic-algorithm';
import { CovariateJson } from '../covariate';
import { DerivedFieldJson } from '../derived-field';
import { IAlgorithmJson } from './algorithm-json';
import { Algorithm } from './algorithm';
export interface IAlgorithmJson extends IGenericAlgorithm<CovariateJson, string, number> {
    derivedFields: DerivedFieldJson[];
}
export declare function parseUserFunctions(userFunctionsJson: IAlgorithmJson['userFunctions']): Algorithm['userFunctions'];
export declare function parseAlgorithmJson(coxJson: IAlgorithmJson): Algorithm;
