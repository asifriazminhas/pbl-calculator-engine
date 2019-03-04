"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape"); // tslint:disable-next-line


var csvParse = require('csv-parse/lib/sync');

var fs = require("fs");

var chai_1 = require("chai");

var undefined_1 = require("../util/undefined/undefined");

var constants_1 = require("./constants");

var binsDataCsvString = fs.readFileSync("".concat(constants_1.TestAssetsFolderPath, "/bins/bins-data.csv"), 'utf8');

var no_bin_found_error_1 = require("../engine/errors/no-bin-found-error");

var build_from_assets_folder_1 = require("../engine/survival-model-builder/build-from-assets-folder");

var bins_1 = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/bins/bins");

var json_bins_1 = require("../parsers/json/json-bins");

test("convertBinsLookupCsvToBinsLookupJson function", function (t) {
  t.test("When the csv file is correct", function (t) {
    var binsLookupCsvString = fs.readFileSync("".concat(constants_1.TestAssetsFolderPath, "/bins/valid-bins-lookup.csv"), 'utf8');
    var binsLookupCsv = csvParse(binsLookupCsvString, {
      columns: true
    });
    var binsLookup = build_from_assets_folder_1.convertBinsLookupCsvToBinsLookupJson(binsLookupCsvString);
    chai_1.expect(binsLookupCsv.length).to.equal(binsLookup.length);
    t.pass("It should have the same number of items as the number of rows in the csv file");
    binsLookupCsv.forEach(function (binsLookupCsvRow) {
      var currentRowInBinsLookup = undefined_1.throwErrorIfUndefined(binsLookup.find(function (binLookupItem) {
        return binLookupItem.binNumber === Number(binsLookupCsvRow.BinNumber);
      }), new Error("No bin found in bins lookup for number ".concat(binsLookupCsvRow.BinNumber)));
      chai_1.expect(isNaN(Number(binsLookupCsvRow.MaxXscore)) ? binsLookupCsvRow.MaxXscore : Number(binsLookupCsvRow.MaxXscore)).to.equal(currentRowInBinsLookup.maxScore);
      chai_1.expect(isNaN(Number(binsLookupCsvRow.MinXscore)) ? binsLookupCsvRow.MinXscore : Number(binsLookupCsvRow.MinXscore)).to.equal(currentRowInBinsLookup.minScore);
      chai_1.expect(Number(binsLookupCsvRow.BinNumber)).to.equal(currentRowInBinsLookup.binNumber);
    });
    t.pass("It should corrrectly set the value of each item");
    t.end();
  });
  t.test("When the csv file is incorrect", function (t) {
    t.test("When a value in the MinXscore column is not a number and is not a valid infinity string", function (t) {
      var invalidBinsLookupCsvString = fs.readFileSync("".concat(constants_1.TestAssetsFolderPath, "/bins/invalid-bins-lookup-MinXscore.csv"), 'utf8');
      chai_1.expect(build_from_assets_folder_1.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
      t.pass("It should throw an Error");
      t.end();
    });
    t.test("When a value in the MaxXscore column is not a valid number and is not a valid infinity string", function (t) {
      var invalidBinsLookupCsvString = fs.readFileSync("".concat(constants_1.TestAssetsFolderPath, "/bins/invalid-bins-lookup-MaxXscore.csv"), 'utf8');
      chai_1.expect(build_from_assets_folder_1.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
      t.pass("It should throw an Error");
      t.end();
    });
    t.test("When a value in the BinNumber column is not a valid number", function (t) {
      var invalidBinsLookupCsvString = fs.readFileSync("".concat(constants_1.TestAssetsFolderPath, "/bins/invalid-bins-lookup-BinNumber.csv"), 'utf8');
      chai_1.expect(build_from_assets_folder_1.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
      t.pass("It should throw an Error");
      t.end();
    });
  });
});
test("convertBinsDataCsvToBinsData function", function (t) {
  var binsDataCsv = csvParse(binsDataCsvString, {
    columns: true
  });
  var binsData = build_from_assets_folder_1.convertBinsDataCsvToBinsData(binsDataCsvString);
  var binsDataBins = Object.keys(binsData).map(Number);
  var numberOfBinsInBinsDataCsv = Object.keys(binsDataCsv[0]).length - 1;
  chai_1.expect(binsDataBins.length).to.equal(numberOfBinsInBinsDataCsv, 'Incorrect number of bins');
  t.pass("Number of bins in bins data is the same as the csv");
  binsDataBins.forEach(function (binsDataBinNumber) {
    var binDataForCurrentBin = binsData[binsDataBinNumber];
    binsDataCsv.forEach(function (binsDataCsvRow) {
      var binDataRowForCurrentSurvivalPercent = binDataForCurrentBin.find(function (binDataRow) {
        return binDataRow.survivalPercent === Number(binsDataCsvRow.Percent);
      }); // tslint:disable-next-line

      chai_1.expect(binDataRowForCurrentSurvivalPercent, "No bin data found for  ".concat(binsDataCsvRow.Percent)).to.not.be.undefined;

      if (isNaN(Number(binsDataCsvRow[String(binsDataBinNumber)]))) {
        chai_1.expect(binDataRowForCurrentSurvivalPercent.time, "time field should be undefined for bin number ".concat(binsDataBinNumber, " and survival percent ").concat(binsDataCsvRow.Percent)).to.be.undefined;
      } else {
        chai_1.expect(binDataRowForCurrentSurvivalPercent.time, "Incorrect time field for bin ".concat(binsDataBinNumber, " and survival percent ").concat(binsDataCsvRow.Percent)).to.equal(Number(binsDataCsvRow[String(binsDataBinNumber)]));
      }
    });
  });
  t.pass("Bins data object has the same data as csv");
  t.end();
});
test("getBinDataForScore function", function (t) {
  var bins = new bins_1.Bins({
    binsData: {
      2: [{
        survivalPercent: 100,
        time: 0
      }, {
        survivalPercent: 99,
        time: 180
      }]
    },
    binsLookup: [{
      minScore: 0,
      maxScore: 1,
      binNumber: 1
    }, {
      minScore: 1,
      maxScore: 2,
      binNumber: 2
    }]
  });
  t.test("When a bin lookup was found", function (t) {
    chai_1.expect(bins.getBinDataForScore(2)).to.equal( // @ts-ignore
    bins.binsData['2']);
    t.pass("It should return the right bin data");
    t.end();
  });
  t.test("When a bin lookup was not found", function (t) {
    try {
      bins.getBinDataForScore(3);
    } catch (err) {
      chai_1.expect(err).to.be.an.instanceof(no_bin_found_error_1.NoBinFoundError);
      t.pass("It should throw a NoBinFoundError");
      return t.end();
    }

    t.error('NoBinFoundError not thrown');
    return t.end();
  });
});
test("getBinsFromBinsJson function", function (t) {
  var binsLookupJson = [{
    minScore: json_bins_1.NegativeInfinityString,
    maxScore: 0,
    binNumber: 1
  }, {
    minScore: 0,
    maxScore: 2,
    binNumber: 2
  }, {
    minScore: 2,
    maxScore: json_bins_1.PositiveInfinityString,
    binNumber: 3
  }];
  chai_1.expect(json_bins_1.parseBinsLookupFromBinsJson({
    binsData: [],
    binsLookup: binsLookupJson
  })).to.deep.equal([{
    minScore: -Infinity,
    maxScore: 0,
    binNumber: 1
  }, {
    minScore: 0,
    maxScore: 2,
    binNumber: 2
  }, {
    minScore: 2,
    maxScore: Infinity,
    binNumber: 3
  }]);
  t.pass("It should return a BinsLookupJson array");
  t.end();
});
//# sourceMappingURL=bins.spec.js.map