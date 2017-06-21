import { GenericDataFields, GenericDataField } from '../../../common';
import { CategoricalFieldJson, ContinuousFieldJson } from '../optype';
import { setFieldPrototypeToBaseOrCategoricalOrContinuous } from '../optype';
import { DataField, CategoricalDataField, ContinuousDataField } from '../../../algorithm/data_fields/data_field';

export interface CategoricalDataFieldJson extends GenericDataField, CategoricalFieldJson {}
export interface ContinuousDataFieldJson extends GenericDataField, ContinuousFieldJson {}

export type DataFieldJsonTypes = GenericDataField | CategoricalDataFieldJson | ContinuousDataFieldJson;

export function isContinuousDataField(field: DataFieldJsonTypes): field is ContinuousDataFieldJson {
    return (field as ContinuousDataFieldJson).opType === 'continuous';
}

export function isCategoricalDataField(field: DataFieldJsonTypes): field is CategoricalDataFieldJson {
    return (field as CategoricalDataFieldJson).opType === 'categorical';
}

export function parseDataField(
    dataField: GenericDataFields,
    parsedDataFields: Array<DataField>
): DataField {
    const foundParsedDataField = parsedDataFields
        .find(parsedDataField => parsedDataField.name === dataField.name);

    if (foundParsedDataField) {
        return foundParsedDataField;
    }
    else {
        return setFieldPrototypeToBaseOrCategoricalOrContinuous(
            dataField,
            DataField,
            CategoricalDataField,
            ContinuousDataField
        );
    }
}


