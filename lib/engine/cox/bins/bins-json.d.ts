export declare const PositiveInfinityString = "infinity";
export declare const NegativeInfinityString = "- infinity";
export declare type BinsLookupJsonScoreValue = typeof PositiveInfinityString | typeof NegativeInfinityString | number;
export interface IBinsLookupJsonItem {
    binNumber: number;
    minScore: BinsLookupJsonScoreValue;
    maxScore: BinsLookupJsonScoreValue;
}
export interface IBinsLookupCsvRow {
    BinNumber: string;
    MinXscore: string;
    MaxXscore: string;
}
export declare function convertBinsLookupCsvToBinsLookupJson(binsLookupCsvString: string): IBinsLookupJsonItem[];
