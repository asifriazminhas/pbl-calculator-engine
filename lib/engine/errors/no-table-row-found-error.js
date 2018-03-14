"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoTableRowFoundError extends Error {
    constructor(conditonsObject) {
        super();
        this.message = `No table row found for object ${JSON.stringify(conditonsObject)} `;
    }
}
exports.NoTableRowFoundError = NoTableRowFoundError;
//# sourceMappingURL=no-table-row-found-error.js.map