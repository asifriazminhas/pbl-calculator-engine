import { IDataField, ICategoricalDataField } from '../../pmml';
import { GenericField, GenericCategory, GenericCategoricalOpType } from '../../common/generic-types';
export declare function isCategoricalDataField(dataField: IDataField): dataField is ICategoricalDataField;
export declare function parseCategories(categoricalDataFieldNode: ICategoricalDataField): Array<GenericCategory>;
export declare function addCategoricalFieldsIfCategorical<T extends GenericField>(dataField: T, dataFieldNode: IDataField): T | T & GenericCategoricalOpType;
