"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function datumFactory(name, coefficent) {
    return {
        name,
        coefficent
    };
}
exports.datumFactory = datumFactory;
function datumFromCovariateReferencePointFactory(covariate) {
    return {
        name: covariate.name,
        coefficent: covariate.referencePoint
    };
}
exports.datumFromCovariateReferencePointFactory = datumFromCovariateReferencePointFactory;
//# sourceMappingURL=datum.js.map