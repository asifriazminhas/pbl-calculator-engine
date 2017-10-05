import { Cox } from '../../cox';
import { CoxJson } from '../../common/json-types';
import { Predicate } from '../multiple-algorithm-model/predicate';
import { ModelType } from '../model-type';

export interface GenericMultipleAlgorithmModel<
    U extends Cox | CoxJson
> {
    modelType: ModelType.MultipleAlgorithm;
    algorithms: Array<{
        algorithm: U,
        predicate: Predicate
    }>;
}