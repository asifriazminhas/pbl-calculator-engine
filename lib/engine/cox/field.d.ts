import { Data, Datum } from '../common/datum';
import { GenericField } from '../common/generic-types';
export declare function getDatumForField(field: GenericField, data: Data): Datum | undefined;
export declare function isFieldWithName(field: GenericField, name: string): boolean;
