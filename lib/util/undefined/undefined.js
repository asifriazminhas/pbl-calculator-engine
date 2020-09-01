"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwErrorIfUndefined = throwErrorIfUndefined;
exports.returnEmptyObjectIfUndefined = returnEmptyObjectIfUndefined;
exports.returnEmptyArrayIfUndefined = returnEmptyArrayIfUndefined;
exports.returnEmptyStringIfUndefined = returnEmptyStringIfUndefined;

var _isUndefined2 = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function throwErrorIfUndefined(field, errorToThrow) {
  if ((0, _isUndefined2.default)(field)) {
    throw errorToThrow;
  } else {
    return field;
  }
}

function returnEmptyObjectIfUndefined(field) {
  return field ? field : {};
}

function returnEmptyArrayIfUndefined(field) {
  return field ? field : [];
}

function returnEmptyStringIfUndefined(field) {
  return field ? field : '';
}
//# sourceMappingURL=undefined.js.map