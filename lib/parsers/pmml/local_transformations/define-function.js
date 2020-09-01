"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDefineFunctions = void 0;

var _merge = require("../../../util/merge");

var mergeDefineFunctions = (0, _merge.getMergeArraysFunction)(function (defineFunction) {
  return defineFunction.$.name;
});
exports.mergeDefineFunctions = mergeDefineFunctions;
//# sourceMappingURL=define-function.js.map