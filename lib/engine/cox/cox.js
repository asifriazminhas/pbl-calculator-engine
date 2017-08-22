"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("./covariate");
const lodash_1 = require("lodash");
const env_1 = require("../common/env");
const moment = require("moment");
function calculateScore(cox, data) {
    return cox.covariates
        .map(covariate => covariate_1.getComponent(covariate, data))
        .reduce(lodash_1.add);
}
//By default it's time argument is set to 1 year from now
function getSurvivalToTime(cox, data, time) {
    let formattedTime;
    if (!time) {
        formattedTime = moment();
        formattedTime.add(1, 'year');
    }
    else if (time instanceof Date) {
        formattedTime = moment(time);
    }
    else {
        formattedTime = time;
    }
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
    const oneYearSurvivalProbability = 1 - Math.pow(Math.E, -1 * cox.baselineHazard * Math.pow(Math.E, score));
    return oneYearSurvivalProbability * Math.abs((moment().diff(formattedTime, 'years', true)));
}
exports.getSurvivalToTime = getSurvivalToTime;
function getRisk(cox, data) {
    return 1 - getSurvivalToTime(cox, data);
}
exports.getRisk = getRisk;
//# sourceMappingURL=cox.js.map