"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regression_algorithm_1 = require("../regression-algorithm");
const bins_1 = require("./bins/bins");
const moment = require("moment");
const lodash_1 = require("lodash");
const env_1 = require("../../../../util/env");
const calibration_1 = require("./calibration/calibration");
const baseline_1 = require("../baseline/baseline");
// tslint:disable-next-line:max-line-length
const non_interaction_covariate_1 = require("../../../data-field/covariate/non-interaction-covariats/non-interaction-covariate");
const calibration_errors_1 = require("./calibration/calibration-errors");
const predicate_1 = require("../../../predicate/predicate");
const predicate_errors_1 = require("../../../predicate/predicate-errors");
const interaction_covariate_1 = require("../../../data-field/covariate/interaction-covariate/interaction-covariate");
class CoxSurvivalAlgorithm extends regression_algorithm_1.RegressionAlgorithm {
    constructor(coxSurvivalAlgorithmJson) {
        super(coxSurvivalAlgorithmJson);
        this.maximumTime = coxSurvivalAlgorithmJson.maximumTime;
        this.baseline = new baseline_1.Baseline(coxSurvivalAlgorithmJson.baseline);
        this.bins = coxSurvivalAlgorithmJson.bins
            ? new bins_1.Bins(coxSurvivalAlgorithmJson.bins)
            : undefined;
        this.timeMetric = coxSurvivalAlgorithmJson.timeMetric;
        this.calibration = new calibration_1.Calibration();
    }
    buildDataNameReport(headers) {
        const found = [];
        const missingRequired = [];
        const missingOptional = [];
        const ignored = [...headers];
        this.covariates.forEach(covariate => {
            if (covariate.customFunction)
                return;
            if (covariate instanceof interaction_covariate_1.InteractionCovariate)
                return;
            const headerWasProvided = headers.includes(covariate.name);
            if (headerWasProvided) {
                found.push(covariate);
                ignored.splice(ignored.indexOf(covariate.name), 1);
            }
            else {
                if (covariate.isRequired) {
                    missingRequired.push(covariate);
                }
                else {
                    missingOptional.push(covariate);
                }
            }
        });
        return {
            found: this.sortCovariatesByName(found),
            missingRequired: this.sortCovariatesByName(missingRequired),
            missingOptional: this.sortCovariatesByName(missingOptional),
            ignored: ignored.sort((a, b) => a.localeCompare(b)),
        };
    }
    evaluate(data, time) {
        return this.getRiskToTime(data, time);
    }
    getRiskToTime(data, time) {
        if (this.bins) {
            return (1 -
                this.getSurvivalToTimeWithBins(data, time));
        }
        else {
            return this.getRiskToTimeWithoutBins(data, time);
        }
    }
    getSurvivalToTime(data, time) {
        return 1 - this.getRiskToTime(data, time);
    }
    updateBaseline(newBaseline) {
        const updatedAlgorithm = Object.assign({}, this, {
            baseline: new baseline_1.Baseline(newBaseline),
        });
        return Object.setPrototypeOf(updatedAlgorithm, CoxSurvivalAlgorithm.prototype);
    }
    addPredictor(predictor) {
        const newCovariate = new non_interaction_covariate_1.NonInteractionCovariate({
            dataFieldType: 0,
            beta: predictor.betaCoefficent,
            referencePoint: predictor.referencePoint
                ? predictor.referencePoint
                : 0,
            name: predictor.name,
            groups: [],
            isRequired: false,
            metadata: {
                label: '',
                shortLabel: '',
            },
        }, undefined, undefined);
        return Object.setPrototypeOf(Object.assign({}, this, {
            covariates: this.covariates.concat(newCovariate),
        }), CoxSurvivalAlgorithm.prototype);
    }
    addCalibrationToAlgorithm(calibrationJson, predicateData) {
        try {
            const calibrationFactorObjects = predicate_1.Predicate.getFirstTruePredicateObject(calibrationJson.map(currentCalibrationJson => {
                return Object.assign({}, currentCalibrationJson, {
                    predicate: new predicate_1.Predicate(currentCalibrationJson.predicate.equation, currentCalibrationJson.predicate.variables),
                });
            }), predicateData).calibrationFactorObjects;
            const calibration = calibrationFactorObjects.reduce((calibrationFactors, currentCalibrationFactorObject) => {
                calibrationFactors[currentCalibrationFactorObject.age] =
                    currentCalibrationFactorObject.factor;
                return calibrationFactors;
            }, {});
            return Object.setPrototypeOf(Object.assign({}, this, {
                calibration: new calibration_1.Calibration(calibration),
            }), CoxSurvivalAlgorithm.prototype);
        }
        catch (err) {
            if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
                console.warn(new calibration_errors_1.NoCalibrationFoundError(predicateData).message);
                return this;
            }
            else {
                throw Error;
            }
        }
    }
    /**
     * Goes though all the fields part of this algorithm and tries to find one
     * whose name matches with the name arg. Throws an Error if no DataField is
     * found
     *
     * @param {string} name
     * @returns {DataField}
     * @memberof CoxSurvivalAlgorithm
     */
    findDataField(name) {
        for (const covariate of this.covariates) {
            if (covariate.name === name) {
                return covariate;
            }
            else {
                const foundDescendantField = covariate
                    .getDescendantFields()
                    .find(field => {
                    return field.name === name;
                });
                if (foundDescendantField) {
                    return foundDescendantField;
                }
            }
        }
        throw new Error(`No DataField found with name ${name}`);
    }
    getSurvivalToTimeWithBins(data, time) {
        const score = this.calculateScore(data);
        const binDataForScore = this.bins.getBinDataForScore(score);
        const today = moment();
        today.startOf('day');
        const startOfDayForTimeArg = moment(time);
        startOfDayForTimeArg.startOf('day');
        const timeDifference = Math.abs(today.diff(startOfDayForTimeArg, this.timeMetric));
        const binDataForTimeIndex = lodash_1.sortedLastIndexBy(binDataForScore, { time: timeDifference, survivalPercent: 0 }, binDataRow => {
            return binDataRow.time ? binDataRow.time : this.maximumTime;
        });
        return binDataForTimeIndex === 0
            ? 0.99
            : binDataForScore[binDataForTimeIndex - 1].survivalPercent / 100;
    }
    getRiskToTimeWithoutBins(data, time) {
        let formattedTime;
        if (!time) {
            formattedTime = moment().startOf('day');
            formattedTime.add(this.maximumTime, this.timeMetric);
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
        const score = this.calculateScore(data);
        // baseline*calibration*e^score
        const exponentiatedScoreTimesBaselineTimesCalibration = this.baseline.getBaselineForData(data) *
            this.calibration.getCalibrationFactorForData(data) *
            Math.E ** score;
        const maximumTimeRiskProbability = 1 - Math.E ** -exponentiatedScoreTimesBaselineTimesCalibration;
        return (maximumTimeRiskProbability * this.getTimeMultiplier(formattedTime));
    }
    getTimeMultiplier(time) {
        return Math.min(Math.abs(moment()
            .startOf('day')
            .diff(time, this.timeMetric, true)) / this.maximumTime, 1);
    }
    sortCovariatesByName(covariates) {
        return covariates.sort((a, b) => a.name.localeCompare(b.name));
    }
}
exports.CoxSurvivalAlgorithm = CoxSurvivalAlgorithm;
//# sourceMappingURL=cox-survival-algorithm.js.map