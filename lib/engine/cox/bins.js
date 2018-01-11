"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
function convertBinsLookupCsvToBinsLookup(binsLookupCsvString) {
    const binsLookupCsv = csvParse(binsLookupCsvString, {
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
exports.convertBinsLookupCsvToBinsLookup = convertBinsLookupCsvToBinsLookup;
function convertBinsDataCsvToBinsData(binsDataCsvString) {
    const binsDataCsv = csvParse(binsDataCsvString, {
        columns: true,
    });
    /* This object has all the bins numbers as the field names but the actual
    values are just empty objects i.e. the data for each percent is not in there */
    const binsDataWithoutPercents = 
    /* Start with getting all the column names in the first csv row */
    Object.keys(binsDataCsv[0])
        .filter(binsDataCsvColumn => binsDataCsvColumn !== 'Percent')
        .map(Number)
        .reduce((currentBinsData, currentBinDataCsvBinNumber) => {
        /* Return an object which is a concatination of the
        previous objects along with the current bin number */
        return Object.assign({}, currentBinsData, { [currentBinDataCsvBinNumber]: {} });
    }, {});
    /* This adds all the percent data to the above binsDataWithoutPercents
    object */
    return binsDataCsv.reduce((currentBinsData, currentBinsDataCsvRow) => {
        // Get all the bin numbers
        Object.keys(currentBinsData)
            .map(Number)
            .forEach(binNumber => {
            /* Check if the value in the csv row for the current bin
            number and percent is a number or a dot. A dot means that
            there is no data for this percent (everybody has already died) */
            const isValueForCurrentBinNumberANumber = !isNaN(Number(currentBinsDataCsvRow[String(binNumber)]));
            /* Update the percent data object for this bin to either
            the number if it is one or undefined if it is a dot*/
            currentBinsData[binNumber] = Object.assign({}, currentBinsData[binNumber], { [Number(currentBinsDataCsvRow.Percent)]: isValueForCurrentBinNumberANumber
                    ? Number(currentBinsDataCsvRow[String(binNumber)])
                    : undefined });
        });
        return currentBinsData;
    }, binsDataWithoutPercents);
}
exports.convertBinsDataCsvToBinsData = convertBinsDataCsvToBinsData;
//# sourceMappingURL=bins.js.map