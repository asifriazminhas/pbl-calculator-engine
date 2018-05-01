import { IGenericAlgorithm, ITables } from './generic-algorithm';
import { AlgorithmType } from './algorithm-type';

export type IAlgorithm<Z extends AlgorithmType> = IGenericAlgorithm<
    () => any,
    Z
>;

export class Algorithm<Z extends AlgorithmType>
    implements IGenericAlgorithm<() => any, Z> {
    algorithmType: Z;
    name: string;
    version: string;
    description: string;
    userFunctions: { [index: string]: () => any };
    tables: ITables;
}
