import { ModelType } from '../model';

export interface GenericSingleAlgorithmModel<U> {
    modelType: ModelType.SingleAlgorithm;
    algorithm: U;
}
