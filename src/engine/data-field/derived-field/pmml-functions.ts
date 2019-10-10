import moment from 'moment';

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
        return value === null || value === undefined || Number.isNaN(value);
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
        // Convert the array as well as the value to check to an Array to make
        // sure everyting it the same type. If there are type mismatches
        // between entries in the array and the value to check then we can have
        // wrong values
        const array = args.slice(1);
        const valueToCheck = args[0];
        const strArray = array.map(arrItem => {
            return arrItem + '';
        });
        const strValueToCheck = valueToCheck + '';

        return strArray.indexOf(strValueToCheck) > -1;
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
    ): string | undefined {
        return str === undefined || str === null
            ? undefined
            : String(str).substr(firstIndex - 1, secondIndex - 1);
    },
    nchar: function(str: string): number | undefined {
        return str === undefined || str === null ? undefined : str.length;
    },
    'as.numeric': function(variableToCoerce: any): number | undefined {
        return variableToCoerce;
    },
    'is.null': function(value: any): boolean {
        return value === null;
    },
    zScore: function(mean: number, sd: number, value: number): number {
        return (value - mean) / sd;
    },
};
