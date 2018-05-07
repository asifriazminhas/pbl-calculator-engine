import { BasePmmlNode } from '../common';
import { getMergeArraysFunction } from '../../../engine/merge';

export interface IBaseDataField<T> extends BasePmmlNode {
    $: {
        name: string;
        displayName: string;
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

export interface ICategoricalDataField extends IBaseDataField<'continuous'> {
    Value?: IValue[] | IValue;
}

export interface IInterval {
    $: {
        closure: 'openOpen' | 'openClosed' | 'closedOpen' | 'closedClosed';
        leftMargin: string;
        rightMargin: string;
    };
}

export interface IContinuousDataField extends IBaseDataField<'categorical'> {
    Interval: IInterval;
}

export type IDataField = IContinuousDataField | ICategoricalDataField;

export const mergeDataFields = getMergeArraysFunction(
    (dataField: IDataField) => {
        return dataField.$.name;
    },
);
