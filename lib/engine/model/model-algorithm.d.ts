import { Predicate } from '../predicate/predicate';
export declare class ModelAlgorithm<T> {
    algorithm: T;
    predicate: Predicate;
    constructor(algorithm: T, predicate: Predicate);
}
