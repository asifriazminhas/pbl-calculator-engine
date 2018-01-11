"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoBinFoundError extends Error {
    constructor(risk) {
        super();
        this.message = `No Bin found for risk ${risk}`;
    }
}
exports.NoBinFoundError = NoBinFoundError;
//# sourceMappingURL=no-bin-found-error.js.map