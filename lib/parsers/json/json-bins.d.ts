import { JsonSerializable } from '../../util/types';
import { Bins, BinsLookup } from '../../engine/algorithm/regression-algorithm/cox-survival-algorithm/bins/bins';
import { Omit } from 'utility-types';
export declare const PositiveInfinityString = "infinity";
export declare const NegativeInfinityString = "- infinity";
export declare type BinsLookupJsonScoreValue = typeof PositiveInfinityString | typeof NegativeInfinityString | number;
export interface IBinsLookupJsonItem {
    binNumber: number;
    minScore: BinsLookupJsonScoreValue;
    maxScore: BinsLookupJsonScoreValue;
}
export interface IBinsJson extends Omit<JsonSerializable<Bins>, 'binsLookup'> {
    binsLookup: IBinsLookupJsonItem[];
}
export declare function parseBinsLookupFromBinsJson(binsJson: IBinsJson): BinsLookup;
