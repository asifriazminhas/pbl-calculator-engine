import { GenericBaseDerivedField } from './generic-base-derived-field';
import { CategoricalOpType } from '../../op-type';
export interface GenericCategoricalDerivedField<T> extends GenericBaseDerivedField<T>, CategoricalOpType {
}
