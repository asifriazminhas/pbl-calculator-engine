import { Cox } from '../../cox';
import { CoxJson } from '../../json-parser/json-types';
import { ModelType } from '../model-type';

export interface GenericSingleAlgorithmModel<
    U extends Cox | CoxJson
> {
    modelType: ModelType.SingleAlgorithm;
    algorithm: U;
}