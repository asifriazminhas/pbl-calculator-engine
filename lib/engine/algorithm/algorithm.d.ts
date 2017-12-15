import { IGenericAlgorithm } from './generic-algorithm';
import { AlgorithmType } from './algorithm-type';
export declare type Algorithm<Z extends AlgorithmType> = IGenericAlgorithm<() => any, Z>;
