import { IDataField } from '../../pmml';
import { IDataFieldJson } from '../../../parsers/json/json-data-field';
import { IMiningField } from '../../pmml/mining-schema/mining-field';
export declare function parseDataFieldFromDataFieldPmmlNode(dataFieldNode: IDataField, miningField?: IMiningField): IDataFieldJson;
