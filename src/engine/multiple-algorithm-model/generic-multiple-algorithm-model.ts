import { Predicate } from '../multiple-algorithm-model/predicate';
import { ModelType } from '../model';
import { IGenericAlgorithm } from '../algorithm';

export interface GenericMultipleAlgorithmModel<
    U extends IGenericAlgorithm<any, any, any>
> {
    modelType: ModelType.MultipleAlgorithm;
    algorithms: Array<{
        algorithm: U;
        predicate: Predicate;
    }>;
}
