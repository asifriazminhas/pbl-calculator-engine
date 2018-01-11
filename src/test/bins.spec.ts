import * as test from 'tape';
import {
    BinsLookupCsv,
    convertBinsLookupCsvToBinsLookup,
    convertBinsDataCsvToBinsData,
    BinsDataCsv,
} from '../engine/cox/bins';
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import * as fs from 'fs';
import { expect } from 'chai';
import { throwErrorIfUndefined } from '../engine/undefined/undefined';
import { TestAssetsFolderPath } from './constants';
import { ICoxWithBins, getRiskToTimeForCoxWithBins } from '../engine/cox/cox';
import { AlgorithmType } from '../engine/algorithm/algorithm-type';
import { TimeMetric } from '../engine/cox/time-metric';
const binsLookupCsvString = fs.readFileSync(
    `${TestAssetsFolderPath}/bins/bins-lookup.csv`,
    'utf8',
);
const binsDataCsvString = fs.readFileSync(
    `${TestAssetsFolderPath}/bins/bins-data.csv`,
    'utf8',
);
import * as moment from 'moment';

test(`convertBinsLookupCsvToBinsLookup function`, t => {
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

test(`getRiskToTimeForBins function`, t => {
    const binsData = convertBinsDataCsvToBinsData(binsDataCsvString);

    const coxWithBins: ICoxWithBins = {
        binsLookup: convertBinsLookupCsvToBinsLookup(binsLookupCsvString),
        binsData,
        algorithmType: AlgorithmType.Cox,
        name: '',
        version: '',
        description: '',
        // No covariates meaning that the score will be zero
        covariates: [],
        // Since score is zero the calculated risk for the cox model will be the baseline
        baseline: 0.6,
        userFunctions: {},
        timeMetric: TimeMetric.Days,
        tables: {},
    };

    const DaysAdded = 50;
    const timeOne = moment();
    timeOne.add(DaysAdded, 'days');
    const expectedRiskOne = 1 - 0.7;

    expect(expectedRiskOne).to.equal(
        getRiskToTimeForCoxWithBins(coxWithBins, [], timeOne),
    );
    t.pass(`Expected risk equals calculated risk for simple case`);

    // For testing days after everybody has died in that group
    const NumOfDaysAfterWhichEveryoneIsDead = 1799;
    const timeTwo = moment();
    timeTwo.add(NumOfDaysAfterWhichEveryoneIsDead, 'days');
    const expectedRiskTwo = 1;
    expect(expectedRiskTwo).to.equal(
        getRiskToTimeForCoxWithBins(coxWithBins, [], timeTwo),
    );
    t.pass(
        `Expected risk equals calculated risk for case where time is after everyone has died`,
    );

    t.end();
});
