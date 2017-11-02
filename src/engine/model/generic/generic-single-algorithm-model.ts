import { Cox } from '../../cox';
import { ICoxJson } from '../../cox';
import { ModelType } from '../model-type';

export interface GenericSingleAlgorithmModel<U extends Cox | ICoxJson> {
    modelType: ModelType.SingleAlgorithm;
    algorithm: U;
}
