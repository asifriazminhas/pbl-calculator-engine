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
    [index: number]: number | undefined;
}

export interface IBinsData {
    // The index is the group number
    [index: number]: IBinData;
}

export interface IBinsDataCsvRow {
    Percent: string;
    [index: string]: string;
}

export type BinsDataCsv = IBinsDataCsvRow[];

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
                        [currentBinDataCsvBinNumber]: {},
                    };
                },
                {} as IBinsData,
            );

    /* This adds all the percent data to the above binsDataWithoutPercents
    object */
    return binsDataCsv.reduce(
        (currentBinsData: IBinsData, currentBinsDataCsvRow) => {
            // Get all the bin numbers
            Object.keys(currentBinsData)
                // Convert them to a number
                .map(Number)
                .forEach(binNumber => {
                    /* Check if the value in the csv row for the current bin
                    number and percent is a number or a dot. A dot means that
                    there is no data for this percent (everybody has already died) */
                    const isValueForCurrentBinNumberANumber = !isNaN(
                        Number(currentBinsDataCsvRow[String(binNumber)]),
                    );

                    /* Update the percent data object for this bin to either
                    the number if it is one or undefined if it is a dot*/
                    currentBinsData[binNumber] = {
                        ...currentBinsData[binNumber],
                        [Number(
                            currentBinsDataCsvRow.Percent,
                        )]: isValueForCurrentBinNumberANumber
                            ? Number(currentBinsDataCsvRow[String(binNumber)])
                            : undefined,
                    };
                });

            return currentBinsData;
        },
        binsDataWithoutPercents,
    );
}
