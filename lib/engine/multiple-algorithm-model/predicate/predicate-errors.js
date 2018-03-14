"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoPredicateObjectFoundError extends Error {
    constructor(data) {
        super(`No matching predicate object found for data ${data}`);
    }
}
exports.NoPredicateObjectFoundError = NoPredicateObjectFoundError;
//# sourceMappingURL=predicate-errors.js.map