import moment from 'moment';
declare function ifelse(booleanOne: boolean, whenTrue: any, whenFalse: any): any;
declare const _default: {
    exp: (value: number) => number;
    ln: (value: number) => number;
    'is.na': (value: any) => boolean;
    not: (value: boolean) => boolean;
    notEqual: (valueOne: any, valueTwo: any) => boolean;
    formatDatetime: (date: Date | moment.Moment, format: string) => string;
    max: (num1: number, num2: number) => number;
    sum: (...args: number[]) => number;
    isIn: (...args: number[]) => boolean;
    colonOperator: (start: number, end: number) => number[];
    log: (num: number) => number;
    ifelse: typeof ifelse;
    ifelse2: typeof ifelse;
    floor: (decimal: number) => number;
    pmax: (num1: number, num2: number) => number | undefined;
    exists: (value: any) => boolean;
    substr: (str: string, firstIndex: number, secondIndex: number) => string | undefined;
    nchar: (str: string) => number | undefined;
    'as.numeric': (variableToCoerce: any) => number | undefined;
    'is.null': (value: any) => boolean;
    zScore: (mean: number, sd: number, value: number) => number;
    'as.Date': (dateString: string, format: string) => moment.Moment;
    format: (object: any) => string;
    'Sys.Date': () => moment.Moment;
};
export default _default;
