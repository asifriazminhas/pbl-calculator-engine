import { IDataField, ICategoricalDataField } from '../../pmml';
import { Category, CategoricalOpType } from '../../op-type';
import { Field } from '../../field';
export declare function isCategoricalDataField(dataField: IDataField): dataField is ICategoricalDataField;
export declare function parseCategories(categoricalDataFieldNode: ICategoricalDataField): Array<Category>;
export declare function addCategoricalFieldsIfCategorical<T extends Field>(dataField: T, dataFieldNode: IDataField): T | T & CategoricalOpType;
