"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var merge_1 = require("../../../util/merge");

exports.mergeDefineFunctions = merge_1.getMergeArraysFunction(function (defineFunction) {
  return defineFunction.$.name;
});
//# sourceMappingURL=define-function.js.map