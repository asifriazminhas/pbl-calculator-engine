import { RegressionAlgorithm } from '../regression-algorithm';
import { Bins } from './bins/bins';
import { TimeMetric } from './time-metric';
import { Data } from '../../../data/data';
import * as moment from 'moment';
import { sortedLastIndexBy } from 'lodash';
import { shouldLogDebugInfo } from '../../../../util/env';
import { Calibration } from './calibration/calibration';
import { ICoxSurvivalAlgorithmJson } from '../../../../parsers/json/json-cox-survival-algorithm';
import { Baseline } from '../baseline/baseline';
// tslint:disable-next-line:max-line-length
import { NonInteractionCovariate } from '../../../data-field/covariate/non-interaction-covariats/non-interaction-covariate';
import { CalibrationJson } from '../../../../parsers/json/json-calibration';
import { NoCalibrationFoundError } from './calibration/calibration-errors';
import { Predicate } from '../../../predicate/predicate';
import { NoPredicateObjectFoundError } from '../../../predicate/predicate-errors';
import { BaselineJson } from '../../../../parsers/json/json-baseline';
import { DataField } from '../../../data-field/data-field';

export interface INewPredictor {
    name: string;
    betaCoefficent: number;
    referencePoint: number | undefined;
}

export class CoxSurvivalAlgorithm extends RegressionAlgorithm {
    timeMetric: TimeMetric;
    maximumTime: number;
    bins?: Bins;
    calibration: Calibration;
    baseline: Baseline;

    constructor(coxSurvivalAlgorithmJson: ICoxSurvivalAlgorithmJson) {
        super(coxSurvivalAlgorithmJson);

        this.maximumTime = coxSurvivalAlgorithmJson.maximumTime;
        this.baseline = new Baseline(coxSurvivalAlgorithmJson.baseline);
        this.bins = coxSurvivalAlgorithmJson.bins
            ? new Bins(coxSurvivalAlgorithmJson.bins)
            : undefined;
        this.timeMetric = coxSurvivalAlgorithmJson.timeMetric;
        this.calibration = new Calibration();
    }

    evaluate(data: Data, time?: Date | moment.Moment) {
        return this.getRiskToTime(data, time);
    }

    getRiskToTime(data: Data, time?: Date | moment.Moment) {
        if (this.bins) {
            return (
                1 -
                (this as CoxSurvivalAlgorithm & {
                    bins: Bins;
                }).getSurvivalToTimeWithBins(data, time)
            );
        } else {
            return this.getRiskToTimeWithoutBins(data, time);
        }
    }

    getSurvivalToTime(data: Data, time?: Date | moment.Moment): number {
        return 1 - this.getRiskToTime(data, time);
    }

    updateBaseline(newBaseline: BaselineJson): CoxSurvivalAlgorithm {
        const updatedAlgorithm = Object.assign({}, this, {
            baseline: new Baseline(newBaseline),
        });

        return Object.setPrototypeOf(
            updatedAlgorithm,
            CoxSurvivalAlgorithm.prototype,
        );
    }

    addPredictor(predictor: INewPredictor): CoxSurvivalAlgorithm {
        const newCovariate: NonInteractionCovariate = new NonInteractionCovariate(
            {
                dataFieldType: 0,
                beta: predictor.betaCoefficent,
                referencePoint: predictor.referencePoint
                    ? predictor.referencePoint
                    : 0,
                name: predictor.name,
                groups: [],
                isRequired: true,
                isRecommended: false,
                metadata: {
                    label: '',
                    shortLabel: '',
                },
            },
            undefined,
            undefined,
        );

        return Object.setPrototypeOf(
            Object.assign({}, this, {
                covariates: this.covariates.concat(newCovariate),
            }),
            CoxSurvivalAlgorithm.prototype,
        );
    }

    addCalibrationToAlgorithm(
        calibrationJson: CalibrationJson,
        predicateData: Data,
    ): CoxSurvivalAlgorithm {
        try {
            const calibrationFactorObjects = Predicate.getFirstTruePredicateObject(
                calibrationJson.map(currentCalibrationJson => {
                    return Object.assign({}, currentCalibrationJson, {
                        predicate: new Predicate(
                            currentCalibrationJson.predicate.equation,
                            currentCalibrationJson.predicate.variables,
                        ),
                    });
                }),
                predicateData,
            ).calibrationFactorObjects;

            const calibration = calibrationFactorObjects.reduce(
                (calibrationFactors, currentCalibrationFactorObject) => {
                    calibrationFactors[currentCalibrationFactorObject.age] =
                        currentCalibrationFactorObject.factor;

                    return calibrationFactors;
                },
                {} as { [index: number]: number },
            );

            return Object.setPrototypeOf(
                Object.assign({}, this, {
                    calibration: new Calibration(calibration),
                }),
                CoxSurvivalAlgorithm.prototype,
            );
        } catch (err) {
            if (err instanceof NoPredicateObjectFoundError) {
                console.warn(
                    new NoCalibrationFoundError(predicateData).message,
                );
                return this;
            } else {
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
    findDataField(name: string): DataField {
        for (const covariate of this.covariates) {
            if (covariate.name === name) {
                return covariate;
            } else {
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

    getRequiredVariables() {
        return this.getAllFields().filter(field => field.isRequired);
    }

    getRecommendedVariables() {
        return this.getAllFields().filter(field => field.isRecommended);
    }

    private getSurvivalToTimeWithBins(
        this: CoxSurvivalAlgorithm & { bins: Bins },
        data: Data,
        time?: Date | moment.Moment,
    ): number {
        const score = this.calculateScore(data);

        const binDataForScore = this.bins.getBinDataForScore(score);

        const today = moment();
        today.startOf('day');

        const startOfDayForTimeArg = moment(time);
        startOfDayForTimeArg.startOf('day');

        const timeDifference = Math.abs(
            today.diff(startOfDayForTimeArg, this.timeMetric),
        );

        const binDataForTimeIndex = sortedLastIndexBy(
            binDataForScore,
            { time: timeDifference, survivalPercent: 0 },
            binDataRow => {
                return binDataRow.time ? binDataRow.time : this.maximumTime;
            },
        );

        return binDataForTimeIndex === 0
            ? 0.99
            : binDataForScore[binDataForTimeIndex - 1].survivalPercent / 100;
    }

    private getRiskToTimeWithoutBins(
        data: Data,
        time?: Date | moment.Moment,
    ): number {
        let formattedTime: moment.Moment;
        if (!time) {
            formattedTime = moment().startOf('day');
            formattedTime.add(this.maximumTime, this.timeMetric);
        } else if (time instanceof Date) {
            formattedTime = moment(time).startOf('day');
        } else {
            formattedTime = time;
        }

        if (shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Predictors`);
        }

        if (shouldLogDebugInfo()) {
            console.log(`Baseline: ${this.baseline}`);
        }

        if (shouldLogDebugInfo() === true) {
            console.groupEnd();
        }

        const score = this.calculateScore(data);
        // baseline*calibration*e^score
        const exponentiatedScoreTimesBaselineTimesCalibration =
            this.baseline.getBaselineForData(data) *
            this.calibration.getCalibrationFactorForData(data) *
            Math.E ** score;
        const maximumTimeRiskProbability =
            1 - Math.E ** -exponentiatedScoreTimesBaselineTimesCalibration;

        return (
            maximumTimeRiskProbability * this.getTimeMultiplier(formattedTime)
        );
    }

    private getTimeMultiplier(time: moment.Moment) {
        return Math.min(
            Math.abs(
                moment()
                    .startOf('day')
                    .diff(time, this.timeMetric, true),
            ) / this.maximumTime,
            1,
        );
    }
}
