import { IGenericAlgorithm } from './generic-algorithm';
import { AlgorithmType } from './algorithm-type';

export type Algorithm<Z extends AlgorithmType> = IGenericAlgorithm<
    () => any,
    Z
>;
