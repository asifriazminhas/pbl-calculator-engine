import { GenericCategoricalField, GenericContinuousDataField } from '../../../common';
import { DataField, CategoricalDataField, ContinuousDataField } from '../../../algorithm/data_fields/data_field';
import { GenericDataField } from '../../../common';
import { isContinuousDataField, isCategoricalDataField } from '../data_fields/data_field';

export interface CategoricalFieldJson extends GenericCategoricalField {
    opType: 'categorical';
}

export interface ContinuousFieldJson extends GenericContinuousDataField {
    opType: 'continuous';
}

export function setFieldPrototypeToBaseOrCategoricalOrContinuous<
    T extends GenericDataField,
    U extends DataField,
    V extends CategoricalDataField & U,
    W extends ContinuousDataField & U
>(
    field: T,
    DataFieldClass: { new (): U },
    CategoricalDataFieldClass: { new (): V },
    ContinuousDataFieldClass: { new (): W }
): U | V | W {
    if (isContinuousDataField(field)) {
        return Object.setPrototypeOf(field, ContinuousDataFieldClass.prototype);
    }
    else if (isCategoricalDataField(field)) {
        return Object.setPrototypeOf(
            field,
            CategoricalDataFieldClass.prototype
        );
    }
    else {
        return Object.setPrototypeOf(field, DataFieldClass.prototype);
    }
}