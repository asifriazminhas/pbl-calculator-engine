"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _tape = _interopRequireDefault(require("tape"));

var fs = _interopRequireWildcard(require("fs"));

var _chai = require("chai");

var _undefined = require("../util/undefined/undefined");

var _constants = require("./constants");

var _noBinFoundError = require("../engine/errors/no-bin-found-error");

var _buildFromAssetsFolder = require("../engine/survival-model-builder/build-from-assets-folder");

var _bins = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/bins/bins");

var _jsonBins = require("../parsers/json/json-bins");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// tslint:disable-next-line
var csvParse = require('csv-parse/lib/sync');

var binsDataCsvString = fs.readFileSync("".concat(_constants.TestAssetsFolderPath, "/bins/bins-data.csv"), 'utf8');
(0, _tape.default)("convertBinsLookupCsvToBinsLookupJson function", function (t) {
  t.test("When the csv file is correct", function (t) {
    var binsLookupCsvString = fs.readFileSync("".concat(_constants.TestAssetsFolderPath, "/bins/valid-bins-lookup.csv"), 'utf8');
    var binsLookupCsv = csvParse(binsLookupCsvString, {
      columns: true
    });
    var binsLookup = (0, _buildFromAssetsFolder.convertBinsLookupCsvToBinsLookupJson)(binsLookupCsvString);
    (0, _chai.expect)(binsLookupCsv.length).to.equal(binsLookup.length);
    t.pass("It should have the same number of items as the number of rows in the csv file");
    binsLookupCsv.forEach(function (binsLookupCsvRow) {
      var currentRowInBinsLookup = (0, _undefined.throwErrorIfUndefined)(binsLookup.find(function (binLookupItem) {
        return binLookupItem.binNumber === Number(binsLookupCsvRow.BinNumber);
      }), new Error("No bin found in bins lookup for number ".concat(binsLookupCsvRow.BinNumber)));
      (0, _chai.expect)(isNaN(Number(binsLookupCsvRow.MaxXscore)) ? binsLookupCsvRow.MaxXscore : Number(binsLookupCsvRow.MaxXscore)).to.equal(currentRowInBinsLookup.maxScore);
      (0, _chai.expect)(isNaN(Number(binsLookupCsvRow.MinXscore)) ? binsLookupCsvRow.MinXscore : Number(binsLookupCsvRow.MinXscore)).to.equal(currentRowInBinsLookup.minScore);
      (0, _chai.expect)(Number(binsLookupCsvRow.BinNumber)).to.equal(currentRowInBinsLookup.binNumber);
    });
    t.pass("It should corrrectly set the value of each item");
    t.end();
  });
  t.test("When the csv file is incorrect", function (t) {
    t.test("When a value in the MinXscore column is not a number and is not a valid infinity string", function (t) {
      var invalidBinsLookupCsvString = fs.readFileSync("".concat(_constants.TestAssetsFolderPath, "/bins/invalid-bins-lookup-MinXscore.csv"), 'utf8');
      (0, _chai.expect)(_buildFromAssetsFolder.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
      t.pass("It should throw an Error");
      t.end();
    });
    t.test("When a value in the MaxXscore column is not a valid number and is not a valid infinity string", function (t) {
      var invalidBinsLookupCsvString = fs.readFileSync("".concat(_constants.TestAssetsFolderPath, "/bins/invalid-bins-lookup-MaxXscore.csv"), 'utf8');
      (0, _chai.expect)(_buildFromAssetsFolder.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
      t.pass("It should throw an Error");
      t.end();
    });
    t.test("When a value in the BinNumber column is not a valid number", function (t) {
      var invalidBinsLookupCsvString = fs.readFileSync("".concat(_constants.TestAssetsFolderPath, "/bins/invalid-bins-lookup-BinNumber.csv"), 'utf8');
      (0, _chai.expect)(_buildFromAssetsFolder.convertBinsLookupCsvToBinsLookupJson.bind(null, invalidBinsLookupCsvString)).throw(Error);
      t.pass("It should throw an Error");
      t.end();
    });
  });
});
(0, _tape.default)("convertBinsDataCsvToBinsData function", function (t) {
  var binsDataCsv = csvParse(binsDataCsvString, {
    columns: true
  });
  var binsData = (0, _buildFromAssetsFolder.convertBinsDataCsvToBinsData)(binsDataCsvString);
  var binsDataBins = Object.keys(binsData).map(Number);
  var numberOfBinsInBinsDataCsv = Object.keys(binsDataCsv[0]).length - 1;
  (0, _chai.expect)(binsDataBins.length).to.equal(numberOfBinsInBinsDataCsv, 'Incorrect number of bins');
  t.pass("Number of bins in bins data is the same as the csv");
  binsDataBins.forEach(function (binsDataBinNumber) {
    var binDataForCurrentBin = binsData[binsDataBinNumber];
    binsDataCsv.forEach(function (binsDataCsvRow) {
      var binDataRowForCurrentSurvivalPercent = binDataForCurrentBin.find(function (binDataRow) {
        return binDataRow.survivalPercent === Number(binsDataCsvRow.Percent);
      }); // tslint:disable-next-line

      (0, _chai.expect)(binDataRowForCurrentSurvivalPercent, "No bin data found for  ".concat(binsDataCsvRow.Percent)).to.not.be.undefined;

      if (isNaN(Number(binsDataCsvRow[String(binsDataBinNumber)]))) {
        (0, _chai.expect)(binDataRowForCurrentSurvivalPercent.time, "time field should be undefined for bin number ".concat(binsDataBinNumber, " and survival percent ").concat(binsDataCsvRow.Percent)).to.be.undefined;
      } else {
        (0, _chai.expect)(binDataRowForCurrentSurvivalPercent.time, "Incorrect time field for bin ".concat(binsDataBinNumber, " and survival percent ").concat(binsDataCsvRow.Percent)).to.equal(Number(binsDataCsvRow[String(binsDataBinNumber)]));
      }
    });
  });
  t.pass("Bins data object has the same data as csv");
  t.end();
});
(0, _tape.default)("getBinDataForScore function", function (t) {
  var bins = new _bins.Bins({
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
    (0, _chai.expect)(bins.getBinDataForScore(2)).to.equal( // @ts-ignore
    bins.binsData['2']);
    t.pass("It should return the right bin data");
    t.end();
  });
  t.test("When a bin lookup was not found", function (t) {
    try {
      bins.getBinDataForScore(3);
    } catch (err) {
      (0, _chai.expect)(err).to.be.an.instanceof(_noBinFoundError.NoBinFoundError);
      t.pass("It should throw a NoBinFoundError");
      return t.end();
    }

    t.error('NoBinFoundError not thrown');
    return t.end();
  });
});
(0, _tape.default)("getBinsFromBinsJson function", function (t) {
  var binsLookupJson = [{
    minScore: _jsonBins.NegativeInfinityString,
    maxScore: 0,
    binNumber: 1
  }, {
    minScore: 0,
    maxScore: 2,
    binNumber: 2
  }, {
    minScore: 2,
    maxScore: _jsonBins.PositiveInfinityString,
    binNumber: 3
  }];
  (0, _chai.expect)((0, _jsonBins.parseBinsLookupFromBinsJson)({
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