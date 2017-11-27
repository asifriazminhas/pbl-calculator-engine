import { Data, IDatum } from '../data';
export interface Field {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    };
}
export declare function getDatumForField(field: Field, data: Data): IDatum | undefined;
export declare function isFieldWithName(field: Field, name: string): boolean;
