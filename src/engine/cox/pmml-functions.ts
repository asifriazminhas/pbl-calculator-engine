import * as moment from 'moment';

export default {
    exp: function(value: number) {
        return Math.exp(value);
    },
    ln: function(value: number) {
        return Math.log(value);
    },
    'is.na': function(value: any) {
        return value === null;
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
    ifelse: function(booleanOne: boolean, whenTrue: any, whenFalse: any): any {
        return booleanOne ? whenTrue : whenFalse;
    },
};
