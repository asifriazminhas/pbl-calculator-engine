"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var moment = require("moment");

function ifelse(booleanOne, whenTrue, whenFalse) {
  return booleanOne ? whenTrue : whenFalse;
}

function shouldReturnUndefined(value) {
  return isNaN(value) || value === undefined;
}

exports.default = {
  exp: function exp(value) {
    return Math.exp(value);
  },
  ln: function ln(value) {
    return Math.log(value);
  },
  'is.na': function isNa(value) {
    return value === null || value === undefined || Number.isNaN(value);
  },
  not: function not(value) {
    return !value;
  },
  notEqual: function notEqual(valueOne, valueTwo) {
    return valueOne !== valueTwo;
  },
  formatDatetime: function formatDatetime(date, format) {
    var momentFormatString = format.replace(/%y/gi, 'YYYY').replace(/%d/gi, 'DD').replace(/%m/gi, 'MM');
    return moment(date).format(momentFormatString);
  },
  max: function max(num1, num2) {
    return Math.max(num1, num2);
  },
  sum: function sum() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.reduce(function (currentSum, currentArg) {
      return currentSum + currentArg;
    }, 0);
  },
  isIn: function isIn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return args.slice(1).indexOf(args[0]) > -1;
  },
  log: function log(num) {
    return Math.log10(num);
  },
  ifelse: ifelse,
  ifelse2: ifelse,
  floor: function floor(decimal) {
    return Math.floor(decimal);
  },
  pmax: function pmax(num1, num2) {
    return shouldReturnUndefined(num1) || shouldReturnUndefined(num2) ? undefined : num1 > num2 ? num1 : num2;
  },
  exists: function exists(value) {
    return !(value === undefined || value === null);
  },
  substr: function substr(str, firstIndex, secondIndex) {
    return str === undefined || str === null ? undefined : String(str).substr(firstIndex - 1, secondIndex - 1);
  },
  nchar: function nchar(str) {
    return str === undefined || str === null ? undefined : str.length;
  },
  'as.numeric': function asNumeric(variableToCoerce) {
    return variableToCoerce;
  },
  'is.null': function isNull(value) {
    return value === null;
  }
};
//# sourceMappingURL=pmml-functions.js.map