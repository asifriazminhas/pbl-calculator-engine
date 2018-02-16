import { throwErrorIfUndefined } from '../../undefined/undefined';
import { NoBinFoundError } from '../../errors/index';
import {
    IBinsLookupJsonItem,
    BinsLookupJsonScoreValue,
    NegativeInfinityString,
    PositiveInfinityString,
} from './bins-json';

// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');

export interface IBinLookup {
    binNumber: number;
    minScore: number;
    maxScore: number;
}

export type BinsLookup = IBinLookup[];

export interface IBinData {
    survivalPercent: number;
    time?: number;
}

export interface IBinsData {
    // The index is the group number
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

export type BinsDataCsv = IBinsDataCsvRow[];

export function convertBinsDataCsvToBinsData(
    binsDataCsvString: string,
): IBinsData {
    const binsDataCsv: BinsDataCsv = csvParse(binsDataCsvString, {
        columns: true,
    });

    /* This object has all the bins numbers as the field names but the actual
    values are just empty objects i.e. the data for each percent is not in there */
    const binsDataWithoutPercents: IBinsData =
        /* Start with getting all the column names in the first csv row */
        Object.keys(binsDataCsv[0])
            /* Remove the Percent column. All the other colums are the bin
            numbers as strings */
            .filter(binsDataCsvColumn => binsDataCsvColumn !== 'Percent')
            /* Convert them to a number */
            .map(Number)
            /* Convert it to the object */
            .reduce(
                (currentBinsData, currentBinDataCsvBinNumber) => {
                    /* Return an object which is a concatination of the
                    previous objects along with the current bin number */
                    return {
                        ...currentBinsData,
                        [currentBinDataCsvBinNumber]: [],
                    };
                },
                {} as IBinsData,
            );

    const binNumbers = Object.keys(binsDataCsv[0])
        .filter(binsDataCsvColumn => {
            return binsDataCsvColumn !== 'Percent';
        })
        .map(Number);

    binsDataCsv.forEach(binsDataCsvRow => {
        binNumbers.forEach(binNumber => {
            binsDataWithoutPercents[binNumber].push({
                survivalPercent: Number(binsDataCsvRow.Percent),
                time: isNaN(Number(binsDataCsvRow[String(binNumber)]))
                    ? undefined
                    : Number(binsDataCsvRow[String(binNumber)]),
            });
        });
    });

    return binsDataWithoutPercents;
}

export function getBinDataForScore(
    { binsLookup, binsData }: IBins,
    score: number,
): IBinData[] {
    // Get the bin number for the above cox risk and throw an error if nothing was found
    const binNumber = throwErrorIfUndefined(
        binsLookup.find((binsLookupRow, index) => {
            if (index !== binsLookup.length - 1) {
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

    return binsData[binNumber];
}

function getBinLookupScoreFromBinsLookupJsonItemScore(
    score: BinsLookupJsonScoreValue,
): number {
    return score === PositiveInfinityString
        ? Infinity
        : score === NegativeInfinityString ? -Infinity : Number(score);
}
export function getBinsLookupFromBinsLookupJson(
    binsLookupJson: IBinsLookupJsonItem[],
): BinsLookup {
    return binsLookupJson.map(binLookupJsonItem => {
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
