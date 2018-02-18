import * as moment from 'moment';

function ifelse(booleanOne: boolean, whenTrue: any, whenFalse: any): any {
    return booleanOne ? whenTrue : whenFalse;
}

function shouldReturnUndefined(value: any): boolean {
    return isNaN(value) || value === undefined;
}

export default {
    exp: function(value: number) {
        return Math.exp(value);
    },
    ln: function(value: number) {
        return Math.log(value);
    },
    'is.na': function(value: any) {
        return value === null || value === undefined;
    },
    not: function(value: boolean) {
        return !value;
    },
    notEqual: function(valueOne: any, valueTwo: any) {
        return valueOne !== valueTwo;
    },
    formatDatetime: function(
        date: moment.Moment | Date,
        format: string,
    ): string {
        const momentFormatString = format
            .replace(/%y/gi, 'YYYY')
            .replace(/%d/gi, 'DD')
            .replace(/%m/gi, 'MM');

        return moment(date).format(momentFormatString);
    },
    max: function(num1: number, num2: number): number {
        return Math.max(num1, num2);
    },
    sum: function(...args: Array<number>): number {
        return args.reduce((currentSum, currentArg) => {
            return currentSum + currentArg;
        }, 0);
    },
    isIn: function(...args: Array<number>): boolean {
        return args.slice(1).indexOf(args[0]) > -1;
    },
    log: function(num: number): number {
        return Math.log10(num);
    },
    ifelse: ifelse,
    ifelse2: ifelse,
    floor: function(decimal: number): number {
        return Math.floor(decimal);
    },
    pmax: function(num1: number, num2: number): number | undefined {
        return shouldReturnUndefined(num1) || shouldReturnUndefined(num2)
            ? undefined
            : num1 > num2 ? num1 : num2;
    },
    exists: function(value: any): boolean {
        return !(value === undefined || value === null);
    },
    substr: function(
        str: string,
        firstIndex: number,
        secondIndex: number,
    ): string {
        return str.substr(firstIndex - 1, secondIndex - 1);
    },
    nchar: function(str: string): number {
        return str.length;
    },
};
