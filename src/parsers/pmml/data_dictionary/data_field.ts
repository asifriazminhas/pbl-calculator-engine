import { BasePmmlNode } from '../common';
import { getMergeArraysFunction } from '../../../util/merge';

export interface IBaseDataField<T> extends BasePmmlNode {
    $: {
        name: string;
        displayName: string;
        'X-shortLabel': string;
        optype: T;
        dataType: string;
    };
}

export interface IValue {
    $: {
        value: string;
        displayName: string;
        description: string;
    };
}

export interface ICategoricalDataField extends IBaseDataField<'categorical'> {
    Value?: IValue[] | IValue;
}

export interface IInterval {
    $: {
        closure: 'openOpen' | 'openClosed' | 'closedOpen' | 'closedClosed';
        leftMargin?: string;
        rightMargin?: string;
    };
}

export interface IContinuousDataField extends IBaseDataField<'continuous'> {
    Interval: IInterval | IInterval[];
}

export type IDataField = IContinuousDataField | ICategoricalDataField;

export const mergeDataFields = getMergeArraysFunction(
    (dataField: IDataField) => {
        return dataField.$.name;
    },
);
