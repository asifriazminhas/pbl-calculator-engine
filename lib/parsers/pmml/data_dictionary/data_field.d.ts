import { BasePmmlNode } from '../common';
export interface IBaseDataField<T> extends BasePmmlNode {
    $: {
        name: string;
        displayName: string;
        'X-shortLabel': string;
        'X-required': string;
        'X-recommended': string;
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
        'X-description': string;
    };
}
export interface IContinuousDataField extends IBaseDataField<'continuous'> {
    Interval: IInterval | IInterval[];
}
export declare type IDataField = IContinuousDataField | ICategoricalDataField;
export declare const mergeDataFields: (arrayOne: IDataField[], arrayTwo: IDataField[]) => IDataField[];
