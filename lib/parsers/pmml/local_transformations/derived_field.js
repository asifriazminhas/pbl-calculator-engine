"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("../../../util/merge");
exports.mergeDerivedFields = merge_1.getMergeArraysFunction((derivedField) => {
    return derivedField.$.name;
});
//# sourceMappingURL=derived_field.js.map