import { Data, Datum } from '../common/datum';
import { Field } from '../field';

export function getDatumForField(
    field: Field,
    data: Data
): Datum | undefined {
    return data.find(datum => datum.name === field.name);
}

export function isFieldWithName(
    field: Field,
    name: string
): boolean {
    return field.name === name;
}