"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ifelse(booleanOne, whenTrue, whenFalse) {
  return booleanOne ? whenTrue : whenFalse;
}

function shouldReturnUndefined(value) {
  return isNaN(value) || value === undefined;
}

var _default = {
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
    return (0, _moment.default)(date).format(momentFormatString);
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

    // The first argument is always the value we need to check is within an Array
    var valueToCheck = args[0];
    var strValueToCheck = valueToCheck + ''; // The rest of the arguments can either be numbers or an Array.
    // We start with assuming that the rest of the arguments are just numbers so we will slice that into an Array

    var array = args.slice(1); // Here we check they passed in an Array as a second argument and if they did then that's what we need to use

    if (Array.isArray(array[0])) {
      array = array[0];
    } // Convert everything to a string since we don't want to check the type


    var strArray = array.map(function (arrItem) {
      return arrItem + '';
    });
    return strArray.indexOf(strValueToCheck) > -1;
  },
  colonOperator: function colonOperator(start, end) {
    var arr = [];

    for (var i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
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
  },
  zScore: function zScore(mean, sd, value) {
    return (value - mean) / sd;
  },
  'as.Date': function asDate(dateString, format) {
    var momentFormat = convertRDateFormatToMoment(format);
    return (0, _moment.default)(dateString, momentFormat);
  },
  format: function format(object) {
    if (_moment.default.isMoment(object)) {
      var momentFormat = convertRDateFormatToMoment(arguments[1]);
      return object.format(momentFormat);
    }

    throw new Error("Unhandled object type in PMML format function.");
  },
  'Sys.Date': function SysDate() {
    return (0, _moment.default)();
  }
};
exports.default = _default;

function convertRDateFormatToMoment(rFormat) {
  var RToMomentFormats = {
    '%d': 'DD',
    '%m': 'MM',
    '%Y': 'YYYY'
  };
  return Object.keys(RToMomentFormats).reduce(function (currentMomentFormat, currentRToMomentFormatKey) {
    return currentMomentFormat.replace(new RegExp(rFormat, 'g'), RToMomentFormats[currentRToMomentFormatKey]);
  }, rFormat);
}
//# sourceMappingURL=pmml-functions.js.map