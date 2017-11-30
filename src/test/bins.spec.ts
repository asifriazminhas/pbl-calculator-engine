import * as test from 'tape';
import {
    BinsLookupCsv,
    convertBinsLookupCsvToBinsLookup,
    convertBinsDataCsvToBinsData,
    BinsDataCsv,
} from '../engine/cox/bins';
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import { throwErrorIfUndefined } from '../engine/undefined/undefined';
import { TestAssetsDirPath } from './constants';

test(`convertBinsLookupCsvToBinsLookup function`, t => {
    const binsLookupCsvString = fs.readFileSync(
        `${TestAssetsDirPath}/bins/bins-lookup.csv`,
        'utf8',
    );

    const binsLookupCsv: BinsLookupCsv = csvParse(binsLookupCsvString, {
        columns: true,
    });

    const binsLookup = convertBinsLookupCsvToBinsLookup(binsLookupCsvString);

    expect(binsLookupCsv.length).to.equal(binsLookup.length);
    t.pass(`Bins lookup has same number of items as bins lookup csv`);

    binsLookupCsv.forEach(binsLookupCsvRow => {
        const currentRowInBinsLookup = throwErrorIfUndefined(
            binsLookup.find(binLookupItem => {
                return (
                    binLookupItem.binNumber ===
                    Number(binsLookupCsvRow.BinNumber)
                );
            }),
            new Error(
                `No bin found in bins lookup for number ${binsLookupCsvRow.BinNumber}`,
            ),
        );

        expect(Number(binsLookupCsvRow.MaxRisk)).to.equal(
            currentRowInBinsLookup.maxRisk,
        );
        expect(Number(binsLookupCsvRow.MinRisk)).to.equal(
            currentRowInBinsLookup.minRisk,
        );
        expect(Number(binsLookupCsvRow.BinNumber)).to.equal(
            currentRowInBinsLookup.binNumber,
        );
    });
    t.pass(`Bins lookup items has same data as bins lookup csv`);

    t.end();
});

test(`convertBinsDataCsvToBinsData function`, t => {
    const binsDataCsvString = fs.readFileSync(
        `${TestAssetsDirPath}/bins/bins-data.csv`,
        'utf8',
    );
    const binsDataCsv: BinsDataCsv = csvParse(binsDataCsvString, {
        columns: true,
    });

    const binsData = convertBinsDataCsvToBinsData(binsDataCsvString);

    const binsDataBins = Object.keys(binsData).map(Number);

    const numberOfBinsInBinsDataCsv = Object.keys(binsDataCsv[0]).length - 1;

    expect(numberOfBinsInBinsDataCsv).to.equal(binsDataBins.length);
    t.pass(`Number of bins in bins data is the same as the csv`);

    binsDataBins.forEach(binsDataBinNumber => {
        const percents = Object.keys(binsData[binsDataBinNumber]).map(Number);

        percents.forEach(percent => {
            const csvDataForCurrentPercent = throwErrorIfUndefined(
                binsDataCsv.find(binsDataCsvRow => {
                    return Number(binsDataCsvRow.Percent) === percent;
                }),
                new Error(`No bins data csv row found for percent ${percent}`),
            );

            if (csvDataForCurrentPercent[String(binsDataBinNumber)] !== '.') {
                expect(
                    Number(csvDataForCurrentPercent[String(binsDataBinNumber)]),
                ).to.equal(binsData[binsDataBinNumber][percent]);
            } else {
                // tslint:disable-next-line
                expect(binsData[binsDataBinNumber][percent]).to.be.undefined;
            }
        });
    });
    t.pass(`Bins data object has the same data as csv`);

    t.end();
});
