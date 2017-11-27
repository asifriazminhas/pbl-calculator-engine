"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const moment = require("moment");
const algorithm_1 = require("../algorithm");
function getTimeMultiplier(time) {
    return Math.abs(moment()
        .startOf('day')
        .diff(time, 'years', true));
}
exports.getTimeMultiplier = getTimeMultiplier;
// By default it's time argument is set to 1 year from now
function getSurvivalToTime(cox, data, time) {
    let formattedTime;
    if (!time) {
        formattedTime = moment().startOf('day');
        formattedTime.add(1, 'year');
    }
    else if (time instanceof Date) {
        formattedTime = moment(time).startOf('day');
    }
    else {
        formattedTime = time;
    }
    if (env_1.shouldLogDebugInfo() === true) {
        console.groupCollapsed(`Predictors`);
    }
    if (env_1.shouldLogDebugInfo()) {
        console.log(`Baseline: ${this.baseline}`);
    }
    if (env_1.shouldLogDebugInfo() === true) {
        console.groupEnd();
    }
    const score = algorithm_1.calculateScore(cox, data);
    const oneYearSurvivalProbability = 1 - algorithm_1.getBaselineForData(cox, data) * Math.pow(Math.E, score);
    return oneYearSurvivalProbability * getTimeMultiplier(formattedTime);
}
exports.getSurvivalToTime = getSurvivalToTime;
function getRiskToTime(cox, data, time) {
    return 1 - getSurvivalToTime(cox, data, time);
}
exports.getRiskToTime = getRiskToTime;
//# sourceMappingURL=cox.js.map