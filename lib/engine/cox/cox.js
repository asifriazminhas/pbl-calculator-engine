"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("./covariate");
const lodash_1 = require("lodash");
const env_1 = require("../common/env");
function calculateScore(cox, data) {
    return cox.covariates
        .map(covariate => covariate_1.getComponent(covariate, data))
        .reduce(lodash_1.add);
}
function getSurvival(cox, data) {
    if (env_1.shouldLogDebugInfo() === true) {
        console.groupCollapsed(`Predictors`);
    }
    if (env_1.shouldLogDebugInfo()) {
        console.log(`Baseline Hazard: ${this.baselineHazard}`);
    }
    if (env_1.shouldLogDebugInfo() === true) {
        console.groupEnd();
    }
    const score = calculateScore(cox, data);
    return 1 - Math.pow(Math.E, -1 * cox.baselineHazard * Math.pow(Math.E, score));
}
exports.getSurvival = getSurvival;
function getRisk(cox, data) {
    return 1 - getSurvival(cox, data);
}
exports.getRisk = getRisk;
//# sourceMappingURL=cox.js.map