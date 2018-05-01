import { IAlgorithm, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import { Data } from '../data';
import { DerivedField } from '../data-field/derived-field/derived-field';

export interface ISimpleAlgorithm
    extends IAlgorithm<AlgorithmType.SimpleAlgorithm>,
        IGenericSimpleAlgorithm<() => any, DerivedField> {}

export function evaluate(algorithm: ISimpleAlgorithm, data: Data): number {
    return algorithm.output.calculateCoefficent(
        data,
        algorithm.userFunctions,
        algorithm.tables,
    ) as number;
}
