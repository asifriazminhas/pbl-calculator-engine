"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const moment = require("moment");
const lodash_1 = require("lodash");
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
const baseline_1 = require("../regression-algorithm/baseline/baseline");
const bins_1 = require("./bins/bins");
const calibration_1 = require("../regression-algorithm/calibration/calibration");
function getTimeMultiplier(time, timeMetric, maximumTime) {
    return Math.min(Math.abs(moment()
        .startOf('day')
        .diff(time, timeMetric, true)) / maximumTime, 1);
}
exports.getTimeMultiplier = getTimeMultiplier;
// By default it's time argument is set to 1 year from now
function getSurvivalToTime(cox, data, time) {
    return 1 - getRiskToTime(cox, data, time);
}
exports.getSurvivalToTime = getSurvivalToTime;
function getRiskToTimeWithoutBins(cox, data, time) {
    let formattedTime;
    if (!time) {
        formattedTime = moment().startOf('day');
        formattedTime.add(cox.maximumTime, cox.timeMetric);
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
    const score = regression_algorithm_1.calculateScore(cox, data);
    // baseline*calibration*e^score
    const exponentiatedScoreTimesBaselineTimesCalibration = baseline_1.getBaselineForData(cox, data) *
        calibration_1.getCalibrationFactorForData(cox, data) *
        Math.pow(Math.E, score);
    const maximumTimeRiskProbability = 1 - Math.pow(Math.E, -exponentiatedScoreTimesBaselineTimesCalibration);
    return (maximumTimeRiskProbability *
        getTimeMultiplier(formattedTime, cox.timeMetric, cox.maximumTime));
}
exports.getRiskToTimeWithoutBins = getRiskToTimeWithoutBins;
function getSurvivalToTimeWithBins(coxWithBins, data, time) {
    const score = regression_algorithm_1.calculateScore(coxWithBins, data);
    const binDataForScore = bins_1.getBinDataForScore(coxWithBins, score);
    const today = moment();
    today.startOf('day');
    const startOfDayForTimeArg = moment(time);
    startOfDayForTimeArg.startOf('day');
    const timeDifference = Math.abs(today.diff(startOfDayForTimeArg, coxWithBins.timeMetric));
    const binDataForTimeIndex = lodash_1.sortedLastIndexBy(binDataForScore, { time: timeDifference, survivalPercent: 0 }, binDataRow => {
        return binDataRow.time ? binDataRow.time : coxWithBins.maximumTime;
    });
    return binDataForTimeIndex === 0
        ? 0.99
        : binDataForScore[binDataForTimeIndex - 1].survivalPercent / 100;
}
exports.getSurvivalToTimeWithBins = getSurvivalToTimeWithBins;
function getRiskToTime(cox, data, time) {
    if (cox.binsData && cox.binsLookup) {
        return 1 - getSurvivalToTimeWithBins(cox, data, time);
    }
    else {
        return getRiskToTimeWithoutBins(cox, data, time);
    }
}
exports.getRiskToTime = getRiskToTime;
//# sourceMappingURL=cox.js.map