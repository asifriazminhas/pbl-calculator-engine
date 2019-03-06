import { JsonInterval } from './json-interval';
import { JsonSerializable } from '../../util/types';
import { DataField } from '../../engine/data-field/data-field';
import { Omit } from 'utility-types';

export interface IDataFieldJson
    extends Omit<JsonSerializable<DataField>, 'intervals'> {
    intervals?: JsonInterval[];
}
