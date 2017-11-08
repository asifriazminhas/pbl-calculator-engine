import { Cox, ICoxJson } from '../cox';
import { Predicate } from '../multiple-algorithm-model/predicate';
import { ModelType } from '../model';

export interface GenericMultipleAlgorithmModel<U extends Cox | ICoxJson> {
    modelType: ModelType.MultipleAlgorithm;
    algorithms: Array<{
        algorithm: U;
        predicate: Predicate;
    }>;
}
