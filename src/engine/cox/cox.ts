import { IBaseCox } from './base-cox';
import { Data } from '../data';
import { shouldLogDebugInfo } from '../env';
import * as moment from 'moment';
import { calculateScore, getBaselineForData } from '../algorithm';
import { BinsLookup, IBinsData } from './bins';
import { throwErrorIfUndefined } from '../undefined';
import { sortedIndex, isUndefined } from 'lodash';
import { NoBinFoundError } from '../errors';

export interface Cox extends IBaseCox {
    binsLookup?: BinsLookup;
    binsData?: IBinsData;
}

export interface ICoxWithBins extends Cox {
    binsLookup: BinsLookup;
    binsData: IBinsData;
}

export function getTimeMultiplier(time: moment.Moment) {
    return Math.abs(
        moment()
            .startOf('day')
            .diff(time, 'years', true),
    );
}

// By default it's time argument is set to 1 year from now
export function getSurvivalToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    let formattedTime: moment.Moment;
    if (!time) {
        formattedTime = moment().startOf('day');
        formattedTime.add(1, 'year');
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

    const oneYearSurvivalProbability =
        1 - getBaselineForData(cox, data) * Math.pow(Math.E, score);

    return oneYearSurvivalProbability * getTimeMultiplier(formattedTime);
}

export function getRiskToTimeForCoxWithBins(
    cox: ICoxWithBins,
    data: Data,
    time?: Date | moment.Moment,
): number {
    // Get the cox risk without any time modifications
    const coxRisk = getRiskToTime(cox, data);

    // Get the bin number for the above cox risk and throw an error if nothing was found
    const binNumberForCalculatedCoxRisk = throwErrorIfUndefined(
        cox.binsLookup.find((binsLookupRow, index) => {
            if (index !== cox.binsLookup.length - 1) {
                return (
                    coxRisk >= binsLookupRow.minRisk &&
                    coxRisk < binsLookupRow.maxRisk
                );
            } else {
                return (
                    coxRisk >= binsLookupRow.minRisk &&
                    coxRisk <= binsLookupRow.maxRisk
                );
            }
        }),
        new NoBinFoundError(coxRisk),
    ).binNumber;

    /* Get the difference in time from the above passed in time using the
    timeMetric field to decide what thje difference is */
    const timeDifference = Math.abs(
        moment()
            .startOf('day')
            .diff(time, cox.timeMetric, true),
    );

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
        sortedIndex(
            percents
                // Remove undefined as the sortedIndex will return a wrong value otherwise
                .filter(percent => !isUndefined(binData[percent]))
                .map(percent => {
                    return binData[percent];
                })
                .reverse(),
            timeDifference,
        );

    if (
        (binData[percents[indexOfClosestValue]] as number) < timeDifference &&
        isUndefined(binData[percents[indexOfClosestValue - 1]])
    ) {
        return 1;
    }

    // Return the percent as the risk. Do a minus one since the bins data has survival
    return 1 - (percents[indexOfClosestValue] as number) / 100;
}

export function getRiskToTime(
    cox: Cox,
    data: Data,
    time?: Date | moment.Moment,
): number {
    return 1 - getSurvivalToTime(cox, data, time);
}
