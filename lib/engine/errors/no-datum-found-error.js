"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoDatumFoundError extends Error {
    constructor(name) {
        super();
        this.message = `No Datum object found with name ${name}`;
    }
}
exports.NoDatumFoundError = NoDatumFoundError;
//# sourceMappingURL=no-datum-found-error.js.map