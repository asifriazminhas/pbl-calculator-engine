import { GenericField } from '../../common/generic-types';
import { IDataField } from '../../pmml';
import { addCategoricalOrContinuousFields } from '../op_type/op_type';
import { parseExtensions } from '../extensions';
import { FieldTypes } from '../../common/field-types';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField
): GenericField {
    return addCategoricalOrContinuousFields(
        {
            name: dataFieldNode.$.name,
            displayName: dataFieldNode.$.displayName,
            extensions: parseExtensions(dataFieldNode),
            fieldType: FieldTypes.DataField
        },
        dataFieldNode,
    );
}