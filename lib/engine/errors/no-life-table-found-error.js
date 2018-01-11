"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoLifeTableFoundError extends Error {
    constructor(sex) {
        super();
        this.message = `No life table found for sex ${sex}`;
    }
}
exports.NoLifeTableFoundError = NoLifeTableFoundError;
//# sourceMappingURL=no-life-table-found-error.js.map