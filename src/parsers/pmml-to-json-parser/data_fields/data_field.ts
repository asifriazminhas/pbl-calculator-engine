import { IDataField } from '../../pmml';
import { IDataFieldJson } from '../../../parsers/json/json-data-field';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField,
): IDataFieldJson {
    return {
        name: dataFieldNode.$.name,
    };
}
