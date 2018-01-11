"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnknownAlgorithmTypeError extends Error {
    constructor(algorithmType) {
        super();
        this.message = `Unknown algorithm tyoe ${algorithmType}`;
    }
}
exports.UnknownAlgorithmTypeError = UnknownAlgorithmTypeError;
//# sourceMappingURL=unknown-algorithm-type-error.js.map