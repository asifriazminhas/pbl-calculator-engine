import { IGenericAlgorithm, AlgorithmType } from '../algorithm';
import { DerivedField } from '../derived-field';
export interface IGenericSimpleAlgorithm<T, V extends string | DerivedField> extends IGenericAlgorithm<T, AlgorithmType.SimpleAlgorithm> {
    output: V;
}
