// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');

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

export interface IBinsLookupCsvRow {
    BinNumber: string;
    MinXscore: string;
    MaxXscore: string;
}

function validateBinsLookupCsvRowScore(score: string): boolean {
    return !isNaN(Number(score))
        ? true
        : score === PositiveInfinityString || score === NegativeInfinityString;
}

function validateBinsLookupCsvRowBinNumber(
    binNumber: IBinsLookupCsvRow['BinNumber'],
): boolean {
    return !isNaN(Number(binNumber));
}

export function convertBinsLookupCsvToBinsLookupJson(
    binsLookupCsvString: string,
): IBinsLookupJsonItem[] {
    const binsLookupCsv: IBinsLookupCsvRow[] = csvParse(binsLookupCsvString, {
        columns: true,
    });

    return binsLookupCsv.map((binsLookupCsvRow, index) => {
        const rowNumber = index + 2;

        if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MaxXscore)) {
            throw new Error(
                `Invalid MaxXscore value ${binsLookupCsvRow.MaxXscore} in row ${rowNumber}`,
            );
        }

        if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MinXscore)) {
            throw new Error(
                `Invalid MinXscore value ${binsLookupCsvRow.MinXscore} in row ${rowNumber}`,
            );
        }

        if (!validateBinsLookupCsvRowBinNumber(binsLookupCsvRow.BinNumber)) {
            throw new Error(
                `Invalid Bin Number value ${binsLookupCsvRow.BinNumber} in row ${rowNumber}`,
            );
        }

        return {
            binNumber: Number(binsLookupCsvRow.BinNumber),
            minScore: isNaN(Number(binsLookupCsvRow.MinXscore))
                ? binsLookupCsvRow.MinXscore as 'infinity'
                : Number(binsLookupCsvRow.MinXscore),
            maxScore: isNaN(Number(binsLookupCsvRow.MaxXscore))
                ? binsLookupCsvRow.MaxXscore as 'infinity'
                : Number(binsLookupCsvRow.MaxXscore),
        };
    });
}
