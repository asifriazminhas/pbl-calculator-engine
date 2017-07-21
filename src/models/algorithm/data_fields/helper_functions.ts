import * as moment from 'moment';

export default {
    exp: function(value: number) {
        return Math.exp(value)
    },
    ln: function(value: number) {
        return Math.log(value)
    },
    'is.na': function(value: string) {
        return value === 'NA'
    },
    not: function(value: boolean) {
        return !value
    },
    notEqual: function(valueOne: any, valueTwo: any) {
        return valueOne !== valueTwo
    },
    formatDatetime: function(date: moment.Moment, format: string): string {
        const momentFormatString = format.replace(/%y/gi, 'YYYY').replace(/%d/gi, 'DD').replace(/%m/gi, 'MM');

        return date.format(momentFormatString);
    },
    max: function(num1: number, num2: number): number {
        return Math.max(num1, num2)
    },
    sum: function (...args: Array<number>): number {
        return args.reduce((currentSum, currentArg) => {
            return currentSum + currentArg;
        }, 0)
    }
}