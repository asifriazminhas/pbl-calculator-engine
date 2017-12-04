import { IGenericAlgorithm, AlgorithmType } from '../algorithm';
import { DerivedField, DerivedFieldJson } from '../derived-field';

export interface IGenericSimpleAlgorithm<
    T,
    U extends DerivedField | DerivedFieldJson
> extends IGenericAlgorithm<T, AlgorithmType.SimpleAlgorithm> {
    derivedFields: U[];
}
