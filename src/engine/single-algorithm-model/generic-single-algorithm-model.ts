import { Cox, ICoxJson } from '../cox';
import { ModelType } from '../model';

export interface GenericSingleAlgorithmModel<U extends Cox | ICoxJson> {
    modelType: ModelType.SingleAlgorithm;
    algorithm: U;
}
