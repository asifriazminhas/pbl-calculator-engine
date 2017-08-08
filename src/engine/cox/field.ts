import { Data, Datum } from '../common/datum';
import { GenericField } from '../common/generic-types';

export function getDatumForField(
    field: GenericField,
    data: Data
): Datum | undefined {
    return data.find(datum => datum.name === field.name);
}

export function isFieldWithName(
    field: GenericField,
    name: string
): boolean {
    return field.name === name;
}