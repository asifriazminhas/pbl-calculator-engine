import { OpType } from '../op-type';
import { Category } from './category';
export interface CategoricalOpType {
    opType: OpType.Categorical;
    categories: Category[];
}
