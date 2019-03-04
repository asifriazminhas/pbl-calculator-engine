"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require("fs");

var web_spec_v1_1 = require("../pmml-transformers/web-spec/web-spec-v1");

var path = require("path"); // tslint:disable-next-line


var csvParse = require('csv-parse/lib/sync');

var survival_model_functions_1 = require("./survival-model-functions");

var json_bins_1 = require("../../parsers/json/json-bins");

var model_1 = require("../model/model");

var pmml_1 = require("../../parsers/pmml-to-json-parser/pmml");

function convertBinsDataCsvToBinsData(binsDataCsvString) {
  var binsDataCsv = csvParse(binsDataCsvString, {
    columns: true
  });
  /* This object has all the bins numbers as the field names but the actual
  values are just empty objects i.e. the data for each percent is not in there */

  var binsDataWithoutPercents =
  /* Start with getting all the column names in the first csv row */
  Object.keys(binsDataCsv[0])
  /* Remove the Percent column. All the other colums are the bin
  numbers as strings */
  .filter(function (binsDataCsvColumn) {
    return binsDataCsvColumn !== 'Percent';
  })
  /* Convert them to a number */
  .map(Number)
  /* Convert it to the object */
  .reduce(function (currentBinsData, currentBinDataCsvBinNumber) {
    /* Return an object which is a concatination of the
    previous objects along with the current bin number */
    return Object.assign({}, currentBinsData, _defineProperty({}, currentBinDataCsvBinNumber, []));
  }, {});
  var binNumbers = Object.keys(binsDataCsv[0]).filter(function (binsDataCsvColumn) {
    return binsDataCsvColumn !== 'Percent';
  }).map(Number);
  binsDataCsv.forEach(function (binsDataCsvRow) {
    binNumbers.forEach(function (binNumber) {
      binsDataWithoutPercents[binNumber].push({
        survivalPercent: Number(binsDataCsvRow.Percent),
        time: isNaN(Number(binsDataCsvRow[String(binNumber)])) ? undefined : Number(binsDataCsvRow[String(binNumber)])
      });
    });
  });
  return binsDataWithoutPercents;
}

exports.convertBinsDataCsvToBinsData = convertBinsDataCsvToBinsData;

function validateBinsLookupCsvRowScore(score) {
  return !isNaN(Number(score)) ? true : score === json_bins_1.PositiveInfinityString || score === json_bins_1.NegativeInfinityString;
}

function validateBinsLookupCsvRowBinNumber(binNumber) {
  return !isNaN(Number(binNumber));
}

function convertBinsLookupCsvToBinsLookupJson(binsLookupCsvString) {
  var binsLookupCsv = csvParse(binsLookupCsvString, {
    columns: true
  });
  return binsLookupCsv.map(function (binsLookupCsvRow, index) {
    var rowNumber = index + 2;

    if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MaxXscore)) {
      throw new Error("Invalid MaxXscore value ".concat(binsLookupCsvRow.MaxXscore, " in row ").concat(rowNumber));
    }

    if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MinXscore)) {
      throw new Error("Invalid MinXscore value ".concat(binsLookupCsvRow.MinXscore, " in row ").concat(rowNumber));
    }

    if (!validateBinsLookupCsvRowBinNumber(binsLookupCsvRow.BinNumber)) {
      throw new Error("Invalid Bin Number value ".concat(binsLookupCsvRow.BinNumber, " in row ").concat(rowNumber));
    }

    return {
      binNumber: Number(binsLookupCsvRow.BinNumber),
      minScore: isNaN(Number(binsLookupCsvRow.MinXscore)) ? binsLookupCsvRow.MinXscore : Number(binsLookupCsvRow.MinXscore),
      maxScore: isNaN(Number(binsLookupCsvRow.MaxXscore)) ? binsLookupCsvRow.MaxXscore : Number(binsLookupCsvRow.MaxXscore)
    };
  });
}

exports.convertBinsLookupCsvToBinsLookupJson = convertBinsLookupCsvToBinsLookupJson;

function getPmmlFileStringsSortedByPriorityInFolder(assetsFolderPath) {
  // Get the names of all the files in the assets directory
  var assetFileNames = fs.readdirSync(assetsFolderPath);
  return assetFileNames.filter(function (pmmlFileName) {
    return pmmlFileName.indexOf('.xml') > -1;
  }).map(function (pmmlFileName) {
    return pmmlFileName.split('.')[0];
  }).map(function (pmmlFileName) {
    return Number(pmmlFileName);
  }).sort(function (pmmlFileNameOne, pmmlFileNameTwo) {
    return pmmlFileNameOne > pmmlFileNameTwo ? 1 : -1;
  }).map(function (pmmlFileName) {
    return '' + pmmlFileName;
  }).map(function (pmmlFileName) {
    return fs.readFileSync("".concat(assetsFolderPath, "/").concat(pmmlFileName, ".xml"), 'utf8');
  });
}

function buildSingleAlgorithmModelJson(_x, _x2, _x3, _x4, _x5) {
  return _buildSingleAlgorithmModelJson.apply(this, arguments);
}

function _buildSingleAlgorithmModelJson() {
  _buildSingleAlgorithmModelJson = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(assetsFolderPath, webSpecifictaionsCsvString, webSpecifictationsCategoriesCsvString, algorithmName, algorithmInfo) {
    var pmmlFileStrings, webSpecificationsPmml, singleAlgorithmJson;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Get the pmml file strings in the directory sorted by priority
            pmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(assetsFolderPath);

            if (webSpecifictaionsCsvString) {
              // Convert webSpecificationsCsvString to Pmml file for both genders
              webSpecificationsPmml = web_spec_v1_1.transformPhiatDictionaryToPmml(algorithmName, webSpecifictaionsCsvString, webSpecifictationsCategoriesCsvString, algorithmInfo, 'both', false, false);
            } // Return SingleAlgorithmModelJson


            _context2.next = 4;
            return pmml_1.pmmlXmlStringsToJson([pmmlFileStrings.concat(webSpecificationsPmml ? webSpecificationsPmml : [])], [{
              equation: 'true',
              variables: []
            }]);

          case 4:
            singleAlgorithmJson = _context2.sent;

            if (fs.existsSync("".concat(assetsFolderPath, "/bins-data.csv"))) {
              singleAlgorithmJson.algorithms[0].algorithm.bins = {
                binsData: convertBinsDataCsvToBinsData(fs.readFileSync("".concat(assetsFolderPath, "/bins-data.csv"), 'utf8')),
                binsLookup: convertBinsLookupCsvToBinsLookupJson(fs.readFileSync("".concat(assetsFolderPath, "/bin-lookup.csv"), 'utf8'))
              };
            }

            return _context2.abrupt("return", singleAlgorithmJson);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _buildSingleAlgorithmModelJson.apply(this, arguments);
}

function buildMultipleAlgorithmModelJson(_x6, _x7, _x8, _x9, _x10) {
  return _buildMultipleAlgorithmModelJson.apply(this, arguments);
}

function _buildMultipleAlgorithmModelJson() {
  _buildMultipleAlgorithmModelJson = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, algorithmName, algorithmInfo) {
    var malePmmlFileStrings, maleWebSpecificationsPmml, maleAlgorithmPmmlFileString, femalePmmlFileStrings, femaleWebSpecificationsPmml, femaleAlgorithmPmmlStrings, multipleAlgorithmModel;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // get the pmml file strings sorted by priority for the male algorithm
            malePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder("".concat(assetsFolderPath, "/male"));

            if (webSpecificationsCsvString) {
              // get the web specifications pmml string for the male model
              maleWebSpecificationsPmml = web_spec_v1_1.transformPhiatDictionaryToPmml(algorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, algorithmInfo, 'Male', false, false);
            } // make the array of pmml strings for the male model


            maleAlgorithmPmmlFileString = malePmmlFileStrings.concat(maleWebSpecificationsPmml ? maleWebSpecificationsPmml : []); // get the pmml file string sorted by priority for the female algorithm

            femalePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder("".concat(assetsFolderPath, "/female"));

            if (webSpecificationsCsvString) {
              // get the web specifications pmml string for the female model
              femaleWebSpecificationsPmml = web_spec_v1_1.transformPhiatDictionaryToPmml(algorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, algorithmInfo, 'Female', false, false);
            } // make the array of pmml string for the female model


            femaleAlgorithmPmmlStrings = femalePmmlFileStrings.concat(femaleWebSpecificationsPmml ? femaleWebSpecificationsPmml : []); // Construct and return the MultipleAlgorithmJson object

            _context3.next = 8;
            return pmml_1.pmmlXmlStringsToJson([maleAlgorithmPmmlFileString, femaleAlgorithmPmmlStrings], [{
              equation: "predicateResult = obj['sex'] === 'male'",
              variables: ['sex']
            }, {
              equation: "predicateResult = obj['sex'] === 'female'",
              variables: ['sex']
            }]);

          case 8:
            multipleAlgorithmModel = _context3.sent;
            multipleAlgorithmModel.algorithms.forEach(function (_ref) {
              var algorithm = _ref.algorithm;
              algorithm.timeMetric = algorithmInfo.TimeMetric;
              algorithm.maximumTime = Number(algorithmInfo.MaximumTime);
            });
            return _context3.abrupt("return", multipleAlgorithmModel);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _buildMultipleAlgorithmModelJson.apply(this, arguments);
}

function getBuildFromAssetsFolder() {
  return {
    buildFromAssetsFolder: function () {
      var _buildFromAssetsFolder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(assetsFolderPath) {
        var currentAlgorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, algorithmsInfoTable, currentAlgorithmInfoFile, modelJson, model;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Get the name of the algorithm from the assetsFolderPath
                currentAlgorithmName = path.basename(assetsFolderPath);

                if (fs.existsSync("".concat(assetsFolderPath, "/web_specifications.csv"))) {
                  // Get web specifications csv file string
                  webSpecificationsCsvString = fs.readFileSync("".concat(assetsFolderPath, "/web_specifications.csv"), 'utf8'); // Get the web specifications categories csv file string

                  webSpecificationsCategoriesCsvString = fs.readFileSync("".concat(assetsFolderPath, "/web_specifications_categories.csv"), 'utf8');
                } // Parse the algorithm info csv file


                algorithmsInfoTable = csvParse(fs.readFileSync("".concat(assetsFolderPath, "/algorithm_info.csv"), 'utf8'), {
                  columns: true
                }); // Get the row with the algorithm we need construct

                currentAlgorithmInfoFile = algorithmsInfoTable.find(function (algorithmInfoRow) {
                  return algorithmInfoRow.AlgorithmName === currentAlgorithmName;
                });

                if (currentAlgorithmInfoFile) {
                  _context.next = 6;
                  break;
                }

                throw new Error("No info found for algorithm with name ".concat(currentAlgorithmName));

              case 6:
                if (!(currentAlgorithmInfoFile.GenderSpecific === 'true')) {
                  _context.next = 12;
                  break;
                }

                _context.next = 9;
                return buildMultipleAlgorithmModelJson(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, currentAlgorithmName, currentAlgorithmInfoFile);

              case 9:
                modelJson = _context.sent;
                _context.next = 15;
                break;

              case 12:
                _context.next = 14;
                return buildSingleAlgorithmModelJson(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, currentAlgorithmName, currentAlgorithmInfoFile);

              case 14:
                modelJson = _context.sent;

              case 15:
                model = new model_1.Model(modelJson);
                return _context.abrupt("return", new survival_model_functions_1.SurvivalModelFunctions(model, modelJson));

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function buildFromAssetsFolder(_x11) {
        return _buildFromAssetsFolder.apply(this, arguments);
      }

      return buildFromAssetsFolder;
    }()
  };
}

exports.getBuildFromAssetsFolder = getBuildFromAssetsFolder;
//# sourceMappingURL=build-from-assets-folder.js.map