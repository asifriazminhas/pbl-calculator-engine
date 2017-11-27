import * as moment from 'moment';
declare const _default: {
    exp: (value: number) => number;
    ln: (value: number) => number;
    'is.na': (value: any) => boolean;
    not: (value: boolean) => boolean;
    notEqual: (valueOne: any, valueTwo: any) => boolean;
    formatDatetime: (date: moment.Moment | Date, format: string) => string;
    max: (num1: number, num2: number) => number;
    sum: (...args: number[]) => number;
    isIn: (...args: number[]) => boolean;
    log: (num: number) => number;
    ifelse: (booleanOne: boolean, whenTrue: any, whenFalse: any) => any;
};
export default _default;
