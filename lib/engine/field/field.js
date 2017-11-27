"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDatumForField(field, data) {
    return data.find(datum => datum.name === field.name);
}
exports.getDatumForField = getDatumForField;
function isFieldWithName(field, name) {
    return field.name === name;
}
exports.isFieldWithName = isFieldWithName;
//# sourceMappingURL=field.js.map