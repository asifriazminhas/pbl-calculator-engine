import { getMergeArraysFunction } from '../../merge';
import { IApply, IConstant, IFieldRef } from './common';

export interface IFieldColumnPair {
    $: {
        column: string;
        field?: string;
        constant?: string;
    };
}

export interface IMapValues {
    $: {
        outputColumn: string;
    };
    '#name': string;
    FieldColumnPair: IFieldColumnPair | IFieldColumnPair[];
    TableLocator: {
        $: {
            location: 'taxonomy';
            name: string;
        };
    };
}

export interface IDerivedField {
    $: {
        name: string;
        optype: string;
    };
    Apply?: IApply;
    Constant?: IConstant;
    FieldRef?: IFieldRef;
    MapValues?: IMapValues;
}

export const mergeDerivedFields = getMergeArraysFunction(
    (derivedField: IDerivedField) => {
        return derivedField.$.name;
    },
);
