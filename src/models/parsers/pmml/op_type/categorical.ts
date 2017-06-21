import { IDataField, ICategoricalDataField } from '../../../pmml';
import { GenericDataField, GenericCategory } from '../../../common/index';
import { CategoricalFieldJson } from '../../json/optype';

export function isCategoricalDataField(dataField: IDataField): dataField is ICategoricalDataField {
    return dataField.$.optype === 'categorical';
}

export function parseCategories(
    categoricalDataFieldNode: ICategoricalDataField
): Array<GenericCategory> {
    if (categoricalDataFieldNode.Value instanceof Array) {
        return categoricalDataFieldNode.Value.map(value => {
            return {
                value: value.$.value,
                displayValue: value.$.displayName,
                description: value.$.description
            };
            });
    } else {
        return [
            {
                value: categoricalDataFieldNode.Value.$.value,
                displayValue: categoricalDataFieldNode.Value.$.displayName,
                description: categoricalDataFieldNode.Value.$.description
            }
        ];
    }
}

export function addCategoricalFieldsIfCategorical<T extends GenericDataField>(
    dataField: T,
    dataFieldNode: IDataField
): T | T & CategoricalFieldJson {
    if (isCategoricalDataField(dataFieldNode)) {
        return Object.assign({}, dataField, {
            opType: dataFieldNode.$.optype,
            categories: parseCategories(dataFieldNode)
        });
    } else {
        return dataField;
    }
}