import { Field, FieldType } from '../field';
export interface BaseDataField extends Field {
    fieldType: FieldType.DataField;
}
