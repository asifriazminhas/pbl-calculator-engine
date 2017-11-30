// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');

export interface IBinLookup {
    binNumber: number;
    minRisk: number;
    maxRisk: number;
}

export type BinsLookup = IBinLookup[];

export interface IBinData {
    // The index is the percent and the value of the index is the time value (days, months years etc.)
    [index: number]: number;
}

export interface IBinsData {
    // The index if the group number
    [index: number]: IBinData;
}

export interface IBinsLookupCsvRow {
    MinRisk: string;
    MaxRisk: string;
    BinNumber: string;
}

export type BinsLookupCsv = IBinsLookupCsvRow[];

export function convertBinsLookupCsvToBinsLookup(
    binsLookupCsvString: string,
): BinsLookup {
    const binsLookupCsv: BinsLookupCsv = csvParse(binsLookupCsvString, {
        columns: true,
    });

    return binsLookupCsv.map(binsLookupCsvRow => {
        return {
            binNumber: Number(binsLookupCsvRow.BinNumber),
            minRisk: Number(binsLookupCsvRow.MinRisk),
            maxRisk: Number(binsLookupCsvRow.MaxRisk),
        };
    });
}
