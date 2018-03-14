"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const bins_1 = require("../engine/cox/bins/bins");
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
const fs = require("fs");
const chai_1 = require("chai");
const undefined_1 = require("../engine/undefined/undefined");
const constants_1 = require("./constants");
const binsDataCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/bins-data.csv`, 'utf8');
const bins_json_1 = require("../engine/cox/bins/bins-json");
const bins_2 = require("../engine/cox/bins/bins");
const no_bin_found_error_1 = require("../engine/errors/no-bin-found-error");
test(`convertBinsLookupCsvToBinsLookupJson function`, t => {
    t.test(`When the csv file is correct`, t => {
        const binsLookupCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/valid-bins-lookup.csv`, 'utf8');
        const binsLookupCsv = csvParse(binsLookupCsvString, {
            columns: true,
        });
        const binsLookup = bins_json_1.convertBinsLookupCsvToBinsLookupJson(binsLookupCsvString);
        chai_1.expect(binsLookupCsv.length).to.equal(binsLookup.length);
        t.pass(`It should have the same number of items as the number of rows in the csv file`);
        binsLookupCsv.forEach(binsLookupCsvRow => {
            const currentRowInBinsLookup = undefined_1.throwErrorIfUndefined(binsLookup.find(binLookupItem => {
                return (binLookupItem.binNumber ===
                    Number(binsLookupCsvRow.BinNumber));
            }), new Error(`No bin found in bins lookup for number ${binsLookupCsvRow.BinNumber}`));
            chai_1.expect(isNaN(Number(binsLookupCsvRow.MaxXscore))
                ? binsLookupCsvRow.MaxXscore
                : Number(binsLookupCsvRow.MaxXscore)).to.equal(currentRowInBinsLookup.maxScore);
            chai_1.expect(isNaN(Number(binsLookupCsvRow.MinXscore))
                ? binsLookupCsvRow.MinXscore
                : Number(binsLookupCsvRow.MinXscore)).to.equal(currentRowInBinsLookup.minScore);
            chai_1.expect(Number(binsLookupCsvRow.BinNumber)).to.equal(currentRowInBinsLookup.binNumber);
        });
        t.pass(`It should corrrectly set the value of each item`);
        t.end();
    });
    t.test(`When the csv file is incorrect`, t => {
        t.test(`When a value in the MinXscore column is not a number and is not a valid infinity string`, t => {
            const invalidBinsLookupCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/invalid-bins-lookup-MinXscore.csv`, 'utf8');
            chai_1.expect(bins_json_1.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
            t.pass(`It should throw an Error`);
            t.end();
        });
        t.test(`When a value in the MaxXscore column is not a valid number and is not a valid infinity string`, t => {
            const invalidBinsLookupCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/invalid-bins-lookup-MaxXscore.csv`, 'utf8');
            chai_1.expect(bins_json_1.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
            t.pass(`It should throw an Error`);
            t.end();
        });
        t.test(`When a value in the BinNumber column is not a valid number`, t => {
            const invalidBinsLookupCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/invalid-bins-lookup-BinNumber.csv`, 'utf8');
            chai_1.expect(bins_json_1.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
            t.pass(`It should throw an Error`);
            t.end();
        });
    });
});
test(`convertBinsDataCsvToBinsData function`, t => {
    const binsDataCsv = csvParse(binsDataCsvString, {
        columns: true,
    });
    const binsData = bins_1.convertBinsDataCsvToBinsData(binsDataCsvString);
    const binsDataBins = Object.keys(binsData).map(Number);
    const numberOfBinsInBinsDataCsv = Object.keys(binsDataCsv[0]).length - 1;
    chai_1.expect(binsDataBins.length).to.equal(numberOfBinsInBinsDataCsv, 'Incorrect number of bins');
    t.pass(`Number of bins in bins data is the same as the csv`);
    binsDataBins.forEach(binsDataBinNumber => {
        const binDataForCurrentBin = binsData[binsDataBinNumber];
        binsDataCsv.forEach(binsDataCsvRow => {
            const binDataRowForCurrentSurvivalPercent = binDataForCurrentBin.find(binDataRow => {
                return (binDataRow.survivalPercent ===
                    Number(binsDataCsvRow.Percent));
            });
            // tslint:disable-next-line
            chai_1.expect(binDataRowForCurrentSurvivalPercent, `No bin data found for  ${binsDataCsvRow.Percent}`).to.not.be.undefined;
            if (isNaN(Number(binsDataCsvRow[String(binsDataBinNumber)]))) {
                chai_1.expect(binDataRowForCurrentSurvivalPercent.time, `time field should be undefined for bin number ${binsDataBinNumber} and survival percent ${binsDataCsvRow.Percent}`).to.be.undefined;
            }
            else {
                chai_1.expect(binDataRowForCurrentSurvivalPercent.time, `Incorrect time field for bin ${binsDataBinNumber} and survival percent ${binsDataCsvRow.Percent}`).to.equal(Number(binsDataCsvRow[String(binsDataBinNumber)]));
            }
        });
    });
    t.pass(`Bins data object has the same data as csv`);
    t.end();
});
test(`getBinDataForScore function`, t => {
    const bins = {
        binsLookup: [
            {
                minScore: 0,
                maxScore: 1,
                binNumber: 1,
            },
            {
                minScore: 1,
                maxScore: 2,
                binNumber: 2,
            },
        ],
        binsData: {
            2: [
                {
                    survivalPercent: 100,
                    time: 0,
                },
                {
                    survivalPercent: 99,
                    time: 180,
                },
            ],
        },
    };
    t.test(`When a bin lookup was found`, t => {
        chai_1.expect(bins_1.getBinDataForScore(bins, 2)).to.equal(
        // @ts-ignore
        bins.binsData['2']);
        t.pass(`It should return the right bin data`);
        t.end();
    });
    t.test(`When a bin lookup was not found`, t => {
        chai_1.expect(bins_1.getBinDataForScore.bind(this, bins, 3)).to.throw(no_bin_found_error_1.NoBinFoundError);
        t.pass(`It should throw a NoBinFoundError`);
        t.end();
    });
});
test(`getBinsLookupJsonToBinsLookup function`, t => {
    const binsLookupJson = [
        {
            minScore: bins_json_1.NegativeInfinityString,
            maxScore: 0,
            binNumber: 1,
        },
        {
            minScore: 0,
            maxScore: 2,
            binNumber: 2,
        },
        {
            minScore: 2,
            maxScore: bins_json_1.PositiveInfinityString,
            binNumber: 3,
        },
    ];
    chai_1.expect(bins_2.getBinsLookupFromBinsLookupJson(binsLookupJson)).to.deep.equal([
        {
            minScore: -Infinity,
            maxScore: 0,
            binNumber: 1,
        },
        {
            minScore: 0,
            maxScore: 2,
            binNumber: 2,
        },
        {
            minScore: 2,
            maxScore: Infinity,
            binNumber: 3,
        },
    ]);
    t.pass(`It should return a BinsLookupJson array`);
    t.end();
});
//# sourceMappingURL=bins.spec.js.map