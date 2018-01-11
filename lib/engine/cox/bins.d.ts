export interface IBinLookup {
    binNumber: number;
    minRisk: number;
    maxRisk: number;
}
export declare type BinsLookup = IBinLookup[];
export interface IBinData {
    [index: number]: number | undefined;
}
export interface IBinsData {
    [index: number]: IBinData;
}
export interface IBinsDataCsvRow {
    Percent: string;
    [index: string]: string;
}
export declare type BinsDataCsv = IBinsDataCsvRow[];
export interface IBinsLookupCsvRow {
    MinRisk: string;
    MaxRisk: string;
    BinNumber: string;
}
export declare type BinsLookupCsv = IBinsLookupCsvRow[];
export declare function convertBinsLookupCsvToBinsLookup(binsLookupCsvString: string): BinsLookup;
export declare function convertBinsDataCsvToBinsData(binsDataCsvString: string): IBinsData;
