import { IPredicate } from '../multiple-algorithm-model/predicate/predicate';
import { ModelType } from '../model';

export interface GenericMultipleAlgorithmModel<U> {
    modelType: ModelType.MultipleAlgorithm;
    algorithms: Array<{
        algorithm: U;
        predicate: IPredicate;
    }>;
}
