"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
class NoBaselineFoundForAge extends Error {
    constructor(age) {
        super();
        this.message = `No baseline hazard object found for age ${age}`;
    }
}
exports.NoBaselineFoundForAge = NoBaselineFoundForAge;
class NoBaselineFoundForAlgorithm extends Error {
    constructor(algorithmName) {
        super();
        this.message = `No baseline hazard found for algorithm ${algorithmName}`;
    }
}
exports.NoBaselineFoundForAlgorithm = NoBaselineFoundForAlgorithm;
//# sourceMappingURL=no-baseline-hazard-found.js.map