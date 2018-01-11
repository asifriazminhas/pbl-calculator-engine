"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const moment = require("moment");
const undefined_1 = require("../undefined");
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
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
    const score = regression_algorithm_1.calculateScore(cox, data);
    const oneYearSurvivalProbability = 1 - regression_algorithm_1.getBaselineForData(cox, data) * Math.pow(Math.E, score);
    return oneYearSurvivalProbability * getTimeMultiplier(formattedTime);
}
exports.getSurvivalToTime = getSurvivalToTime;
function getRiskToTimeForCoxWithBins(cox, data, time) {
    // Get the cox risk without any time modifications
    const coxRisk = getRiskToTime(cox, data);
    // Get the bin number for the above cox risk and throw an error if nothing was found
    const binNumberForCalculatedCoxRisk = undefined_1.throwErrorIfUndefined(cox.binsLookup.find((binsLookupRow, index) => {
        if (index !== cox.binsLookup.length - 1) {
            return (coxRisk >= binsLookupRow.minRisk &&
                coxRisk < binsLookupRow.maxRisk);
        }
        else {
            return (coxRisk >= binsLookupRow.minRisk &&
                coxRisk <= binsLookupRow.maxRisk);
        }
    }), new errors_1.NoBinFoundError(coxRisk)).binNumber;
    /* Get the difference in time from the above passed in time using the
    timeMetric field to decide what thje difference is */
    const timeDifference = Math.abs(moment()
        .startOf('day')
        .diff(time, cox.timeMetric, true));
    /* Get the bin data for the bin this person is in*/
    const binData = cox.binsData[binNumberForCalculatedCoxRisk];
    /* Get the list of percents for this binData */
    const percents = Object.keys(binData).map(Number);
    /* Get the index of the percent value which is the closest to the
    timeDifference */
    const indexOfClosestValue = 
    // Subtract the length since we are reversing the array
    percents.length -
        // Reverse the array since we need to go from low to high values
        lodash_1.sortedIndex(percents
            .filter(percent => !lodash_1.isUndefined(binData[percent]))
            .map(percent => {
            return binData[percent];
        })
            .reverse(), timeDifference);
    if (binData[percents[indexOfClosestValue]] < timeDifference &&
        lodash_1.isUndefined(binData[percents[indexOfClosestValue - 1]])) {
        return 1;
    }
    // Return the percent as the risk. Do a minus one since the bins data has survival
    return 1 - percents[indexOfClosestValue] / 100;
}
exports.getRiskToTimeForCoxWithBins = getRiskToTimeForCoxWithBins;
function getRiskToTime(cox, data, time) {
    return 1 - getSurvivalToTime(cox, data, time);
}
exports.getRiskToTime = getRiskToTime;
//# sourceMappingURL=cox.js.map