import { IAlgorithmJson, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import { DerivedFieldJson } from '../derived-field';
import { ISimpleAlgorithm } from './simple-algorithm';
export interface ISimpleAlgorithmJson extends IAlgorithmJson<AlgorithmType.SimpleAlgorithm>, IGenericSimpleAlgorithm<string, string> {
    derivedFields: DerivedFieldJson[];
}
export declare function parseSimpleAlgorithmJsonToSimpleAlgorithm(simpleAlgorithmJson: ISimpleAlgorithmJson): ISimpleAlgorithm;
