import { throwErrorIfUndefined } from '../../../../../util/undefined/undefined';
import { NoBinFoundError } from '../../../../errors/no-bin-found-error';
import {
    IBinsJson,
    parseBinsLookupFromBinsJson,
} from '../../../../../parsers/json/json-bins';

export class Bins {
    binsData: IBinsData;
    binsLookup: BinsLookup;

    constructor(binsJson: IBinsJson) {
        this.binsData = binsJson.binsData;
        this.binsLookup = parseBinsLookupFromBinsJson(binsJson);
    }

    getBinDataForScore(score: number): IBinData[] {
        // Get the bin number for the above cox risk and throw an error if nothing was found
        const binNumber = throwErrorIfUndefined(
            this.binsLookup.find((binsLookupRow, index) => {
                if (index !== this.binsLookup.length - 1) {
                    return (
                        score >= binsLookupRow.minScore &&
                        score < binsLookupRow.maxScore
                    );
                } else {
                    return (
                        score >= binsLookupRow.minScore &&
                        score <= binsLookupRow.maxScore
                    );
                }
            }),
            new NoBinFoundError(score),
        ).binNumber;

        return this.binsData[binNumber];
    }

    /**
     * Returns the time field for the binDatum with the same survival percent
     * as the survival percent arg
     *
     * @param {number} survivalPercent
     * @param {IBinData[]} binData
     * @returns {number}
     * @memberof Bins
     */
    getTimeForSurvival(survivalPercent: number, binData: IBinData[]): number {
        return throwErrorIfUndefined(
            binData.find(binDatum => {
                return binDatum.survivalPercent === survivalPercent;
            }),
            new Error(
                `No bin datum found for survival percent ${survivalPercent}`,
            ),
        ).time as number;
    }
}

export interface IBinData {
    survivalPercent: number;
    time?: number;
}

export interface IBinsData {
    // The index is the group number
    [index: number]: IBinData[];
}

export interface IBinLookup {
    binNumber: number;
    minScore: number;
    maxScore: number;
}

export type BinsLookup = IBinLookup[];
