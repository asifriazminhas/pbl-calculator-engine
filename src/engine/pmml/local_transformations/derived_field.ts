import { getMergeArraysFunction } from '../../merge';
import { IApply, IConstant, IFieldRef } from './common';

export interface IDerivedField {
    $: {
        name: string;
        optype: string;
    }
    Apply?: IApply;
    Constant?: IConstant;
    FieldRef?: IFieldRef;
}

export const mergeDerivedFields = getMergeArraysFunction(
    (derivedField: IDerivedField) => {
        return derivedField.$.name
    }
);

