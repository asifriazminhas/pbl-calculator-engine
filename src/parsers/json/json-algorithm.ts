import { Omit } from 'utility-types';
import { JsonSerializable } from '../../util/types';
import { Algorithm } from '../../engine/algorithm/algorithm';
import { IUserFunctionsJson } from './json-user-functions';
import { IDerivedFieldJson } from './json-derived-field';

export interface IAlgorithmJson
    extends Omit<JsonSerializable<Algorithm>, 'userFunctions'> {
    userFunctions: IUserFunctionsJson;
    derivedFields: IDerivedFieldJson[];
}
