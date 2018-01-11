"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnknownRegressionType extends Error {
    constructor(regressionType) {
        super();
        this.message = `Unknown regression type ${regressionType}`;
    }
}
exports.UnknownRegressionType = UnknownRegressionType;
//# sourceMappingURL=unknown-regression-type.js.map