"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undefined_1 = require("../../undefined/undefined");
const index_1 = require("../../errors/index");
const bins_json_1 = require("./bins-json");
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
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
        return Object.assign({}, currentBinsData, { [currentBinDataCsvBinNumber]: [] });
    }, {});
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
exports.convertBinsDataCsvToBinsData = convertBinsDataCsvToBinsData;
function getBinDataForScore({ binsLookup, binsData }, score) {
    // Get the bin number for the above cox risk and throw an error if nothing was found
    const binNumber = undefined_1.throwErrorIfUndefined(binsLookup.find((binsLookupRow, index) => {
        if (index !== binsLookup.length - 1) {
            return (score >= binsLookupRow.minScore &&
                score < binsLookupRow.maxScore);
        }
        else {
            return (score >= binsLookupRow.minScore &&
                score <= binsLookupRow.maxScore);
        }
    }), new index_1.NoBinFoundError(score)).binNumber;
    return binsData[binNumber];
}
exports.getBinDataForScore = getBinDataForScore;
function getBinLookupScoreFromBinsLookupJsonItemScore(score) {
    return score === bins_json_1.PositiveInfinityString
        ? Infinity
        : score === bins_json_1.NegativeInfinityString ? -Infinity : Number(score);
}
function getBinsLookupFromBinsLookupJson(binsLookupJson) {
    return binsLookupJson.map(binLookupJsonItem => {
        return {
            minScore: getBinLookupScoreFromBinsLookupJsonItemScore(binLookupJsonItem.minScore),
            maxScore: getBinLookupScoreFromBinsLookupJsonItemScore(binLookupJsonItem.maxScore),
            binNumber: binLookupJsonItem.binNumber,
        };
    });
}
exports.getBinsLookupFromBinsLookupJson = getBinsLookupFromBinsLookupJson;
//# sourceMappingURL=bins.js.map