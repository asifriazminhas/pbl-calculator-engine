"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDerivedFields = void 0;

var _merge = require("../../../util/merge");

var mergeDerivedFields = (0, _merge.getMergeArraysFunction)(function (derivedField) {
  return derivedField.$.name;
});
exports.mergeDerivedFields = mergeDerivedFields;
//# sourceMappingURL=derived_field.js.map