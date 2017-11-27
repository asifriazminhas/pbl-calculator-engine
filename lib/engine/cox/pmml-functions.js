"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
exports.default = {
    exp: function (value) {
        return Math.exp(value);
    },
    ln: function (value) {
        return Math.log(value);
    },
    'is.na': function (value) {
        return value === null;
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
    ifelse: function (booleanOne, whenTrue, whenFalse) {
        return booleanOne ? whenTrue : whenFalse;
    },
};
//# sourceMappingURL=pmml-functions.js.map