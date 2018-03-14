"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function ifelse(booleanOne, whenTrue, whenFalse) {
    return booleanOne ? whenTrue : whenFalse;
}
function shouldReturnUndefined(value) {
    return isNaN(value) || value === undefined;
}
exports.default = {
    exp: function (value) {
        return Math.exp(value);
    },
    ln: function (value) {
        return Math.log(value);
    },
    'is.na': function (value) {
        return value === null || value === undefined;
    },
    not: function (value) {
        return !value;
    },
    notEqual: function (valueOne, valueTwo) {
        return valueOne !== valueTwo;
    },
    formatDatetime: function (date, format) {
        const momentFormatString = format
            .replace(/%y/gi, 'YYYY')
            .replace(/%d/gi, 'DD')
            .replace(/%m/gi, 'MM');
        return moment(date).format(momentFormatString);
    },
    max: function (num1, num2) {
        return Math.max(num1, num2);
    },
    sum: function (...args) {
        return args.reduce((currentSum, currentArg) => {
            return currentSum + currentArg;
        }, 0);
    },
    isIn: function (...args) {
        return args.slice(1).indexOf(args[0]) > -1;
    },
    log: function (num) {
        return Math.log10(num);
    },
    ifelse: ifelse,
    ifelse2: ifelse,
    floor: function (decimal) {
        return Math.floor(decimal);
    },
    pmax: function (num1, num2) {
        return shouldReturnUndefined(num1) || shouldReturnUndefined(num2)
            ? undefined
            : num1 > num2 ? num1 : num2;
    },
    exists: function (value) {
        return !(value === undefined || value === null);
    },
    substr: function (str, firstIndex, secondIndex) {
        return str === undefined || str === null
            ? undefined
            : String(str).substr(firstIndex - 1, secondIndex - 1);
    },
    nchar: function (str) {
        return str === undefined || str === null ? undefined : str.length;
    },
    'as.numeric': function (variableToCoerce) {
        return variableToCoerce;
    },
};
//# sourceMappingURL=pmml-functions.js.map