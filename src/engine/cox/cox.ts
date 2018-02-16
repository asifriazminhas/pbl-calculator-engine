import { IBaseCox } from './base-cox';
import { Data } from '../data';
import { shouldLogDebugInfo } from '../env';
import * as moment from 'moment';
import { sortedLastIndexBy } from 'lodash';
import { AlgorithmType } from '../algorithm/algorithm-type';
import {
    IRegressionAlgorithm,
    calculateScore,
} from '../regression-algorithm/regression-algorithm';
import { getBaselineForData } from '../regression-algorithm/baseline/baseline';
import { TimeMetric } from './time-metric';
import { getBinDataForScore, IBins, IBinsData, BinsLookup } from './bins/bins';

export interface Cox
    extends IBaseCox,
        IRegressionAlgorithm<AlgorithmType.Cox>,
        Partial<IBins> {}

export interface ICoxWithBins extends Cox {
    binsData: IBinsData;
    binsLookup: BinsLookup;
}

export function getTimeMultiplier(
    time: moment.Moment,
    timeMetric: TimeMetric,
    maximumTime: number,
) {
    return Math.min(
        Math.abs(
            moment()
                .startOf('day')
                .diff(time, timeMetric, true),
        ) / maximumTime,
        1,
    );
}

// By default it's time argument is set to 1 year from now
export function getSurvivalToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    return 1 - getRiskToTime(cox, data, time);
}

export function getRiskToTimeWithoutBins(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    let formattedTime: moment.Moment;
    if (!time) {
        formattedTime = moment().startOf('day');
        formattedTime.add(cox.maximumTime, cox.timeMetric);
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

    const score = calculateScore(cox, data);

    const maximumTimeRiskProbability =
        getBaselineForData(cox, data) * Math.pow(Math.E, score);

    return (
        maximumTimeRiskProbability *
        getTimeMultiplier(formattedTime, cox.timeMetric, cox.maximumTime)
    );
}

export function getSurvivalToTimeWithBins(
    coxWithBins: ICoxWithBins,
    data: Data,
    time?: Date | moment.Moment,
): number {
    const score = calculateScore(coxWithBins, data);

    const binDataForScore = getBinDataForScore(coxWithBins, score);

    const today = moment();
    today.startOf('day');

    const startOfDayForTimeArg = moment(time);
    startOfDayForTimeArg.startOf('day');

    const timeDifference = Math.abs(
        today.diff(startOfDayForTimeArg, coxWithBins.timeMetric),
    );

    const binDataForTimeIndex = sortedLastIndexBy(
        binDataForScore,
        { time: timeDifference, survivalPercent: 0 },
        binDataRow => {
            return binDataRow.time ? binDataRow.time : coxWithBins.maximumTime;
        },
    );

    return binDataForTimeIndex === 0
        ? 0.99
        : binDataForScore[binDataForTimeIndex - 1].survivalPercent / 100;
}

export function getRiskToTime(
    cox: Cox | ICoxWithBins,
    data: Data,
    time?: Date | moment.Moment,
) {
    if (cox.binsData && cox.binsLookup) {
        return 1 - getSurvivalToTimeWithBins(cox as ICoxWithBins, data, time);
    } else {
        return getRiskToTimeWithoutBins(cox, data, time);
    }
}
