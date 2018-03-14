import { IPredicate } from '../multiple-algorithm-model/predicate/predicate';
import { ModelType } from '../model';
import { IGenericAlgorithm } from '../algorithm';

export interface GenericMultipleAlgorithmModel<
    U extends IGenericAlgorithm<any, any>
> {
    modelType: ModelType.MultipleAlgorithm;
    algorithms: Array<{
        algorithm: U;
        predicate: IPredicate;
    }>;
}
