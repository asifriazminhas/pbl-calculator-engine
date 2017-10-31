import { Data, IDatum } from '../data';
import { Field } from '../field';

export function getDatumForField(field: Field, data: Data): IDatum | undefined {
    return data.find(datum => datum.name === field.name);
}

export function isFieldWithName(field: Field, name: string): boolean {
    return field.name === name;
}
