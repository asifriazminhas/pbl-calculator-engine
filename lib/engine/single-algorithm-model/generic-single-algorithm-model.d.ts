import { ModelType } from '../model';
import { IGenericAlgorithm } from '../algorithm';
export interface GenericSingleAlgorithmModel<U extends IGenericAlgorithm<any, any>> {
    modelType: ModelType.SingleAlgorithm;
    algorithm: U;
}
