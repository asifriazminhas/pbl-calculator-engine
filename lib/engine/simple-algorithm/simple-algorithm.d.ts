import { Algorithm, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import { DerivedField } from '../derived-field';
import { Data } from '../data';
export interface ISimpleAlgorithm extends Algorithm<AlgorithmType.SimpleAlgorithm>, IGenericSimpleAlgorithm<() => any, DerivedField> {
}
export declare function evaluate(algorithm: ISimpleAlgorithm, data: Data): number;
