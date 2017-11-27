"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function datumFactory(name, coefficent) {
    return {
        coefficent,
        name,
    };
}
exports.datumFactory = datumFactory;
function datumFromCovariateReferencePointFactory(covariate) {
    return {
        coefficent: covariate.referencePoint,
        name: covariate.name,
    };
}
exports.datumFromCovariateReferencePointFactory = datumFromCovariateReferencePointFactory;
//# sourceMappingURL=datum.js.map