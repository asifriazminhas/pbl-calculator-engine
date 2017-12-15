import { Algorithm, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import { DerivedField, calculateCoefficent } from '../derived-field';
import { Data } from '../data';

export interface ISimpleAlgorithm
    extends Algorithm<AlgorithmType.SimpleAlgorithm>,
        IGenericSimpleAlgorithm<() => any, DerivedField> {}

export function evaluate(algorithm: ISimpleAlgorithm, data: Data): number {
    return calculateCoefficent(
        algorithm.output,
        data,
        algorithm.userFunctions,
        algorithm.tables,
    ) as number;
}
