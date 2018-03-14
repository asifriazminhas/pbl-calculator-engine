"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
exports.PositiveInfinityString = 'infinity';
exports.NegativeInfinityString = '- infinity';
function validateBinsLookupCsvRowScore(score) {
    return !isNaN(Number(score))
        ? true
        : score === exports.PositiveInfinityString || score === exports.NegativeInfinityString;
}
function validateBinsLookupCsvRowBinNumber(binNumber) {
    return !isNaN(Number(binNumber));
}
function convertBinsLookupCsvToBinsLookupJson(binsLookupCsvString) {
    const binsLookupCsv = csvParse(binsLookupCsvString, {
        columns: true,
    });
    return binsLookupCsv.map((binsLookupCsvRow, index) => {
        const rowNumber = index + 2;
        if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MaxXscore)) {
            throw new Error(`Invalid MaxXscore value ${binsLookupCsvRow.MaxXscore} in row ${rowNumber}`);
        }
        if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MinXscore)) {
            throw new Error(`Invalid MinXscore value ${binsLookupCsvRow.MinXscore} in row ${rowNumber}`);
        }
        if (!validateBinsLookupCsvRowBinNumber(binsLookupCsvRow.BinNumber)) {
            throw new Error(`Invalid Bin Number value ${binsLookupCsvRow.BinNumber} in row ${rowNumber}`);
        }
        return {
            binNumber: Number(binsLookupCsvRow.BinNumber),
            minScore: isNaN(Number(binsLookupCsvRow.MinXscore))
                ? binsLookupCsvRow.MinXscore
                : Number(binsLookupCsvRow.MinXscore),
            maxScore: isNaN(Number(binsLookupCsvRow.MaxXscore))
                ? binsLookupCsvRow.MaxXscore
                : Number(binsLookupCsvRow.MaxXscore),
        };
    });
}
exports.convertBinsLookupCsvToBinsLookupJson = convertBinsLookupCsvToBinsLookupJson;
//# sourceMappingURL=bins-json.js.map