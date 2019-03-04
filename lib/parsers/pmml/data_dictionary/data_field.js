"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var merge_1 = require("../../../util/merge");

exports.mergeDataFields = merge_1.getMergeArraysFunction(function (dataField) {
  return dataField.$.name;
});
//# sourceMappingURL=data_field.js.map