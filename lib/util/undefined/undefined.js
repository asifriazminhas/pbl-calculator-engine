"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lodash_1 = require("lodash");

function throwErrorIfUndefined(field, errorToThrow) {
  if (lodash_1.isUndefined(field)) {
    throw errorToThrow;
  } else {
    return field;
  }
}

exports.throwErrorIfUndefined = throwErrorIfUndefined;

function returnEmptyObjectIfUndefined(field) {
  return field ? field : {};
}

exports.returnEmptyObjectIfUndefined = returnEmptyObjectIfUndefined;

function returnEmptyArrayIfUndefined(field) {
  return field ? field : [];
}

exports.returnEmptyArrayIfUndefined = returnEmptyArrayIfUndefined;

function returnEmptyStringIfUndefined(field) {
  return field ? field : '';
}

exports.returnEmptyStringIfUndefined = returnEmptyStringIfUndefined;
//# sourceMappingURL=undefined.js.map