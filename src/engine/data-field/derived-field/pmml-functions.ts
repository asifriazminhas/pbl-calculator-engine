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
        // The first argument is always the value we need to check is within an Array
        const valueToCheck = args[0];
        const strValueToCheck = valueToCheck + '';

        // The rest of the arguments can either be numbers or an Array.
        // We start with assuming that the rest of the arguments are just numbers so we will slice that into an Array
        let array = args.slice(1);
        // Here we check they passed in an Array as a second argument and if they did then that's what we need to use
        if (Array.isArray(array[0])) {
            array = array[0];
        }
        // Convert everything to a string since we don't want to check the type
        const strArray = array.map(arrItem => {
            return arrItem + '';
        });

        return strArray.indexOf(strValueToCheck) > -1;
    },
    colonOperator: function(start: number, end: number): number[] {
        const arr: number[] = [];
        for (let i = start; i <= end; i++) {
            arr.push(i);
        }

        return arr;
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
            : num1 > num2
            ? num1
            : num2;
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
    'as.Date': function(dateString: string, format: string) {
        const momentFormat = convertRDateFormatToMoment(format);

        return moment(dateString, momentFormat);
    },
    format: function(object: any): string {
        if (moment.isMoment(object)) {
            const momentFormat = convertRDateFormatToMoment(arguments[1]);

            return object.format(momentFormat);
        }

        throw new Error(`Unhandled object type in PMML format function.`);
    },
    'Sys.Date': function(): moment.Moment {
        return moment();
    },
};

function convertRDateFormatToMoment(rFormat: string): string {
    const RToMomentFormats = {
        '%d': 'DD',
        '%m': 'MM',
        '%Y': 'YYYY',
    };

    return (Object.keys(RToMomentFormats) as Array<
        keyof typeof RToMomentFormats
    >).reduce((currentMomentFormat, currentRToMomentFormatKey) => {
        return currentMomentFormat.replace(
            new RegExp(rFormat, 'g'),
            RToMomentFormats[currentRToMomentFormatKey],
        );
    }, rFormat);
}
