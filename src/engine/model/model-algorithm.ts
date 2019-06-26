import { Predicate } from '../predicate/predicate';

export class ModelAlgorithm<T> {
    algorithm: T;
    predicate: Predicate;

    constructor(algorithm: T, predicate: Predicate) {
        this.algorithm = algorithm;
        this.predicate = predicate;
    }
}
