"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoDerivedFieldFoundError extends Error {
    constructor(derivedFieldName) {
        super();
        this.message = `No derived field found with name ${derivedFieldName}`;
    }
}
exports.NoDerivedFieldFoundError = NoDerivedFieldFoundError;
//# sourceMappingURL=no-derived-field-found-error.js.map