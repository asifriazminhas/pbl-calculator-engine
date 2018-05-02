import { Jsonify } from '../../util/types';
import {
    Bins,
    BinsLookup,
} from '../../engine/algorithm/regression-algorithm/cox-survival-algorithm/bins/bins';
import { Omit } from 'utility-types';

export const PositiveInfinityString = 'infinity';
export const NegativeInfinityString = '- infinity';

export type BinsLookupJsonScoreValue =
    | typeof PositiveInfinityString
    | typeof NegativeInfinityString
    | number;

export interface IBinsLookupJsonItem {
    binNumber: number;
    minScore: BinsLookupJsonScoreValue;
    maxScore: BinsLookupJsonScoreValue;
}

export interface IBinsJson extends Omit<Jsonify<Bins>, 'binsLookup'> {
    binsLookup: IBinsLookupJsonItem[];
}

export function parseBinsLookupFromBinsJson(binsJson: IBinsJson): BinsLookup {
    return binsJson.binsLookup.map(binLookupJsonItem => {
        return {
            minScore: getBinLookupScoreFromBinsLookupJsonItemScore(
                binLookupJsonItem.minScore,
            ),
            maxScore: getBinLookupScoreFromBinsLookupJsonItemScore(
                binLookupJsonItem.maxScore,
            ),
            binNumber: binLookupJsonItem.binNumber,
        };
    });
}

function getBinLookupScoreFromBinsLookupJsonItemScore(
    score: BinsLookupJsonScoreValue,
): number {
    return score === PositiveInfinityString
        ? Infinity
        : score === NegativeInfinityString ? -Infinity : Number(score);
}
