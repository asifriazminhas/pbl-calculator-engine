import { DataFieldJsonTypes } from '../../json/data_fields/data_field';
import { IDataField } from '../../../pmml';
import { addCategoricalOrContinuousFields } from '../op_type/op_type';
import { parseExtensions } from '../extensions';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField
): DataFieldJsonTypes {
    return addCategoricalOrContinuousFields(
        {
            name: dataFieldNode.$.name,
            displayName: dataFieldNode.$.displayName,
            extensions: parseExtensions(dataFieldNode)
        },
        dataFieldNode
    );
}