"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDataFields = void 0;

var _merge = require("../../../util/merge");

var mergeDataFields = (0, _merge.getMergeArraysFunction)(function (dataField) {
  return dataField.$.name;
});
exports.mergeDataFields = mergeDataFields;
//# sourceMappingURL=data_field.js.map