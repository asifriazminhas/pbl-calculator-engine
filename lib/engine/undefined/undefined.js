"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function throwErrorIfUndefined(field, errorToThrow) {
    if (lodash_1.isUndefined(field)) {
        throw errorToThrow;
    }
    else {
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
//# sourceMappingURL=undefined.js.map