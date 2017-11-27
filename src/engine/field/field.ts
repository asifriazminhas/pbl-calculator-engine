import { Data, IDatum } from '../data';

export interface Field {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    };
}

export function getDatumForField(field: Field, data: Data): IDatum | undefined {
    return data.find(datum => datum.name === field.name);
}

export function isFieldWithName(field: Field, name: string): boolean {
    return field.name === name;
}
