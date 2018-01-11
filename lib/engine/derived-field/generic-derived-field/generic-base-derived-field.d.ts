import { Field, FieldType } from '../../field';
export interface GenericBaseDerivedField<T> extends Field {
    fieldType: FieldType.DerivedField;
    equation: string;
    derivedFrom: T[];
}
