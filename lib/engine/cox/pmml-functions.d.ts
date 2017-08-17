import * as moment from 'moment';
declare const _default: {
    exp: (value: number) => number;
    ln: (value: number) => number;
    'is.na': (value: string) => boolean;
    not: (value: boolean) => boolean;
    notEqual: (valueOne: any, valueTwo: any) => boolean;
    formatDatetime: (date: moment.Moment | Date, format: string) => string;
    max: (num1: number, num2: number) => number;
    sum: (...args: number[]) => number;
};
export default _default;
