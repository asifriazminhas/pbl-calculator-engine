import { throwErrorIfUndefined } from '../../../../undefined/undefined';
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
