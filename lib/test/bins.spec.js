"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const bins_1 = require("../engine/cox/bins");
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
const fs = require("fs");
const chai_1 = require("chai");
const undefined_1 = require("../engine/undefined/undefined");
const constants_1 = require("./constants");
const cox_1 = require("../engine/cox/cox");
const algorithm_type_1 = require("../engine/algorithm/algorithm-type");
const time_metric_1 = require("../engine/cox/time-metric");
const binsLookupCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/bins-lookup.csv`, 'utf8');
const binsDataCsvString = fs.readFileSync(`${constants_1.TestAssetsFolderPath}/bins/bins-data.csv`, 'utf8');
const moment = require("moment");
test(`convertBinsLookupCsvToBinsLookup function`, t => {
    const binsLookupCsv = csvParse(binsLookupCsvString, {
        columns: true,
    });
    const binsLookup = bins_1.convertBinsLookupCsvToBinsLookup(binsLookupCsvString);
    chai_1.expect(binsLookupCsv.length).to.equal(binsLookup.length);
    t.pass(`Bins lookup has same number of items as bins lookup csv`);
    binsLookupCsv.forEach(binsLookupCsvRow => {
        const currentRowInBinsLookup = undefined_1.throwErrorIfUndefined(binsLookup.find(binLookupItem => {
            return (binLookupItem.binNumber ===
                Number(binsLookupCsvRow.BinNumber));
        }), new Error(`No bin found in bins lookup for number ${binsLookupCsvRow.BinNumber}`));
        chai_1.expect(Number(binsLookupCsvRow.MaxRisk)).to.equal(currentRowInBinsLookup.maxRisk);
        chai_1.expect(Number(binsLookupCsvRow.MinRisk)).to.equal(currentRowInBinsLookup.minRisk);
        chai_1.expect(Number(binsLookupCsvRow.BinNumber)).to.equal(currentRowInBinsLookup.binNumber);
    });
    t.pass(`Bins lookup items has same data as bins lookup csv`);
    t.end();
});
test(`convertBinsDataCsvToBinsData function`, t => {
    const binsDataCsv = csvParse(binsDataCsvString, {
        columns: true,
    });
    const binsData = bins_1.convertBinsDataCsvToBinsData(binsDataCsvString);
    const binsDataBins = Object.keys(binsData).map(Number);
    const numberOfBinsInBinsDataCsv = Object.keys(binsDataCsv[0]).length - 1;
    chai_1.expect(numberOfBinsInBinsDataCsv).to.equal(binsDataBins.length);
    t.pass(`Number of bins in bins data is the same as the csv`);
    binsDataBins.forEach(binsDataBinNumber => {
        const percents = Object.keys(binsData[binsDataBinNumber]).map(Number);
        percents.forEach(percent => {
            const csvDataForCurrentPercent = undefined_1.throwErrorIfUndefined(binsDataCsv.find(binsDataCsvRow => {
                return Number(binsDataCsvRow.Percent) === percent;
            }), new Error(`No bins data csv row found for percent ${percent}`));
            if (csvDataForCurrentPercent[String(binsDataBinNumber)] !== '.') {
                chai_1.expect(Number(csvDataForCurrentPercent[String(binsDataBinNumber)])).to.equal(binsData[binsDataBinNumber][percent]);
            }
            else {
                // tslint:disable-next-line
                chai_1.expect(binsData[binsDataBinNumber][percent]).to.be.undefined;
            }
        });
    });
    t.pass(`Bins data object has the same data as csv`);
    t.end();
});
test(`getRiskToTimeForBins function`, t => {
    const binsData = bins_1.convertBinsDataCsvToBinsData(binsDataCsvString);
    const coxWithBins = {
        binsLookup: bins_1.convertBinsLookupCsvToBinsLookup(binsLookupCsvString),
        binsData,
        algorithmType: algorithm_type_1.AlgorithmType.Cox,
        name: '',
        version: '',
        description: '',
        // No covariates meaning that the score will be zero
        covariates: [],
        // Since score is zero the calculated risk for the cox model will be the baseline
        baseline: 0.6,
        userFunctions: {},
        timeMetric: time_metric_1.TimeMetric.Days,
        tables: {},
    };
    const DaysAdded = 50;
    const timeOne = moment();
    timeOne.add(DaysAdded, 'days');
    const expectedRiskOne = 1 - 0.7;
    chai_1.expect(expectedRiskOne).to.equal(cox_1.getRiskToTimeForCoxWithBins(coxWithBins, [], timeOne));
    t.pass(`Expected risk equals calculated risk for simple case`);
    // For testing days after everybody has died in that group
    const NumOfDaysAfterWhichEveryoneIsDead = 1799;
    const timeTwo = moment();
    timeTwo.add(NumOfDaysAfterWhichEveryoneIsDead, 'days');
    const expectedRiskTwo = 1;
    chai_1.expect(expectedRiskTwo).to.equal(cox_1.getRiskToTimeForCoxWithBins(coxWithBins, [], timeTwo));
    t.pass(`Expected risk equals calculated risk for case where time is after everyone has died`);
    t.end();
});
//# sourceMappingURL=bins.spec.js.map