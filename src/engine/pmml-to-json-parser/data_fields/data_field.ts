import { Field, FieldType } from '../../field';
import { IDataField } from '../../pmml';
import { addCategoricalOrContinuousFields } from '../op_type/op_type';
import { parseExtensions } from '../extensions';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField
): Field {
    return addCategoricalOrContinuousFields(
        {
            name: dataFieldNode.$.name,
            displayName: dataFieldNode.$.displayName,
            extensions: parseExtensions(dataFieldNode),
            fieldType: FieldType.DataField
        },
        dataFieldNode,
    );
}