import { IBinsLookupJsonItem } from './bins-json';
export interface IBinLookup {
    binNumber: number;
    minScore: number;
    maxScore: number;
}
export declare type BinsLookup = IBinLookup[];
export interface IBinData {
    survivalPercent: number;
    time?: number;
}
export interface IBinsData {
    [index: number]: IBinData[];
}
export interface IBinsDataCsvRow {
    Percent: string;
    [index: string]: string;
}
export interface IBins {
    binsData: IBinsData;
    binsLookup: BinsLookup;
}
export declare type BinsDataCsv = IBinsDataCsvRow[];
export declare function convertBinsDataCsvToBinsData(binsDataCsvString: string): IBinsData;
export declare function getBinDataForScore({binsLookup, binsData}: IBins, score: number): IBinData[];
export declare function getBinsLookupFromBinsLookupJson(binsLookupJson: IBinsLookupJsonItem[]): BinsLookup;
