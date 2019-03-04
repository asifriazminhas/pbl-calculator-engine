import { IBinsJson } from '../../../../../parsers/json/json-bins';
export declare class Bins {
    binsData: IBinsData;
    binsLookup: BinsLookup;
    constructor(binsJson: IBinsJson);
    getBinDataForScore(score: number): IBinData[];
    /**
     * Returns the time field for the binDatum with the same survival percent
     * as the survival percent arg
     *
     * @param {number} survivalPercent
     * @param {IBinData[]} binData
     * @returns {number}
     * @memberof Bins
     */
    getTimeForSurvival(survivalPercent: number, binData: IBinData[]): number;
}
export interface IBinData {
    survivalPercent: number;
    time?: number;
}
export interface IBinsData {
    [index: number]: IBinData[];
}
export interface IBinLookup {
    binNumber: number;
    minScore: number;
    maxScore: number;
}
export declare type BinsLookup = IBinLookup[];
