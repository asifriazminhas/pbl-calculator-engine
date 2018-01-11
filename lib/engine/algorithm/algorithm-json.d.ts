import { IGenericAlgorithm } from './generic-algorithm';
import { DerivedFieldJson } from '../derived-field';
import { IAlgorithmJson } from './algorithm-json';
import { Algorithm } from './algorithm';
import { AlgorithmType } from './algorithm-type';
export interface IAlgorithmJson<Z extends AlgorithmType> extends IGenericAlgorithm<string, Z> {
    derivedFields: DerivedFieldJson[];
}
export declare function parseUserFunctions(userFunctionsJson: IAlgorithmJson<any>['userFunctions']): Algorithm<any>['userFunctions'];
