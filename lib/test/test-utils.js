"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require("fs");

var constants_1 = require("./constants");

var path = require("path");

var model_1 = require("../engine/model/model"); // tslint:disable-next-line:no-var-requires


var createCsvParseStream = require('csv-parse');

function getAlgorithmNamesToTest(excludeAlgorithms) {
  return fs
  /* Get the names of all files and folders in the directory with the
  assets */
  .readdirSync(constants_1.TestAlgorithmsFolderPath)
  /* Filter out all files and keep only directories */
  .filter(function (algorithmFolderFileName) {
    return fs.lstatSync(path.join(constants_1.TestAlgorithmsFolderPath, algorithmFolderFileName)).isDirectory() && algorithmFolderFileName !== '.git' && algorithmFolderFileName !== 'node_modules' && algorithmFolderFileName !== 'build' && algorithmFolderFileName !== '.vscode';
  })
  /* Filter out all algorithm we don't want to test as specified in
  the excludeAlgorithms arg*/
  .filter(function (algorithmName) {
    var includeAlgorithm = excludeAlgorithms.indexOf(algorithmName) === -1;

    if (!includeAlgorithm) {
      console.warn('\x1b[31m', " Excluding model ".concat(algorithmName), '\x1b[0m');
    }

    return includeAlgorithm;
  });
}

function getModelObjFromAlgorithmName(_x) {
  return _getModelObjFromAlgorithmName.apply(this, arguments);
}

function _getModelObjFromAlgorithmName() {
  _getModelObjFromAlgorithmName = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(algorithmName) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new model_1.Model(require("".concat(constants_1.TestAlgorithmsFolderPath, "/").concat(algorithmName, "/model.json"))));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getModelObjFromAlgorithmName.apply(this, arguments);
}

function getModelsToTest(_x2) {
  return _getModelsToTest.apply(this, arguments);
}

function _getModelsToTest() {
  _getModelsToTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(modelsToExclude) {
    var modelNames, models;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            modelNames = getAlgorithmNamesToTest(modelsToExclude);
            _context2.next = 3;
            return Promise.all(modelNames.map(function (algorithmName) {
              return getModelObjFromAlgorithmName(algorithmName);
            }));

          case 3:
            models = _context2.sent;
            return _context2.abrupt("return", models.map(function (model, index) {
              model.name = modelNames[index];
              return {
                model: model,
                name: modelNames[index]
              };
            }));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _getModelsToTest.apply(this, arguments);
}

exports.getModelsToTest = getModelsToTest;

function getPmmlString(derivedFields, tables) {
  var derivedFieldsPmmlString = derivedFields.map(function (derivedField) {
    return "<DerivedField name=\"".concat(derivedField.name, "\" optype=\"continuous\">\n            <MapValues outputColumn=\"").concat(derivedField.mapValues.outputColumn, "\">\n                ").concat(derivedField.mapValues.fieldColumnPairs.map(function (fieldColumnPair) {
      return "<FieldColumnPair\n                            column=\"".concat(fieldColumnPair.column, "\"\n                            constant=\"").concat(fieldColumnPair.constant, "\">\n                        </FieldColumnPair>");
    }), "\n                <TableLocator location=\"taxonomy\" name=\"").concat(derivedField.mapValues.tableName, "\"/>\n            </MapValues>\n        </DerivedField>");
  });
  var taxonomyPmmlString = tables.map(function (table) {
    return "<Taxonomy name=\"".concat(table.name, "\">\n                <InlineTable>\n                    ").concat(table.rows.map(function (row) {
      return "<row>\n                            ".concat(Object.keys(row).map(function (columnName) {
        return "<".concat(columnName, ">").concat(row[columnName], "</").concat(columnName, ">");
      }), "\n                        </row>");
    }), "\n                </InlineTable>\n            </Taxonomy>");
  });
  return "<PMML>\n        <Header copyright=\"Copyright (c) 2016\" description=\"CVDPoRTMale_v0.9\">\n            <Extension name=\"user\" value=\"user\" extender=\"COXPH\"/>\n            <Application name=\"COXPH\" version=\"1.4\"/>\n            <Timestamp>2016-08-30 11:53:28</Timestamp>\n        </Header>\n        <DataDictionary>\n            <DataField name=\"dataFieldOne\"/>\n            <DataField name=\"dataFieldTwo\"/>\n        </DataDictionary>\n        <LocalTransformations>\n            <DefineFunction name=\"testFunctionOne\">\n                <ParameterField name=\"test\"/>\n                <FieldRef field=\"sex\" />\n            </DefineFunction>\n            <DefineFunction name=\"testFunctionTwo\">\n                <ParameterField name=\"test\"/>\n                <FieldRef field=\"sex\" />\n            </DefineFunction>\n            ".concat(derivedFieldsPmmlString, "\n        </LocalTransformations>\n        ").concat(taxonomyPmmlString, "\n        <GeneralRegressionModel\n                modelType=\"CoxRegression\"\n                modelName=\"CVDPoRT_malemodel\"\n                functionName=\"regression\"\n                algorithmName=\"coxph\"\n                endTimeVariable=\"ttcvd_dec12_year\"\n                statusVariable=\"censor_cvd_dec12\">\n            <MiningSchema>\n                <MiningField name=\"survival\" usageType=\"predicted\"/>\n                <MiningField name=\"dataFieldTwo\" usageType=\"active\"/>\n                <MiningField name=\"dataFieldOne\" usageType=\"active\"/>\n            </MiningSchema>\n            <Output>\n                <OutputField name=\"Predicted_survival\" feature=\"predictedValue\"/>\n                <OutputField name=\"cumulativeHazard\" feature=\"transformedValue\">\n                    <Apply function=\"*\">\n                        <Constant>-1.0</Constant>\n                        <Apply function=\"ln\">\n                            <FieldRef field=\"Predicted_survival\"/>\n                        </Apply>\n                    </Apply>\n                </OutputField>\n            </Output>\n            <ParameterList>\n                <Parameter name=\"p0\" label=\"dataFieldOne\"/>\n                <Parameter name=\"p1\" label=\"dataFieldTwo\"/>\n            </ParameterList>\n            <FactorList/>\n            <CovariateList>\n                <Predictor name=\"dataFieldOne\" />\n                <Predictor name=\"dataFieldTwo\"/>\n            </CovariateList>\n            <PPMatrix>\n                <PPCell\n                    value=\"1\" predictorName=\"dataFieldOne\" parameterName=\"p0\"/>\n                <PPCell\n                    value=\"1\" predictorName=\"dataFieldTwo\" parameterName=\"p1\"/>\n            </PPMatrix>\n            <ParamMatrix>\n                <PCell parameterName=\"p0\" df=\"1\" beta=\"0.2022114164395\"/>\n                <PCell parameterName=\"p1\" df=\"1\" beta=\"-0.27529830694182\"/>\n            </ParamMatrix>\n        </GeneralRegressionModel>\n        <CustomPMML>\n        </CustomPMML>\n    </PMML>");
}

exports.getPmmlString = getPmmlString;

function getRelativeDifference(num1, num2) {
  if (!Number(num1) && !Number(num2)) {
    return 0;
  }

  if (Number(num1) === 0 && Number(num2) !== 0) {
    return 100;
  }

  return Math.abs(num1 - num2) / Math.abs(num1) * 100;
}

exports.getRelativeDifference = getRelativeDifference;

function streamValidationCsvFile(filePath, onData, onEnd, onError) {
  var index = 2;
  var readScoreTestingDataFileStream = fs.createReadStream(filePath);
  var readScoreTestingDataCsvStream = createCsvParseStream({
    columns: true
  });
  var scoreTestingDataStream = readScoreTestingDataFileStream.pipe(readScoreTestingDataCsvStream);
  scoreTestingDataStream.on('error', function (error) {
    return onError(error);
  });
  scoreTestingDataStream.on('end', function () {
    return onEnd();
  });
  scoreTestingDataStream.on('data', function (csvRow) {
    onData(Object.keys(csvRow).map(function (currentColumnName) {
      return {
        name: currentColumnName,
        coefficent: csvRow[currentColumnName]
      };
    }), index);
    index += 1;
  });
}

function runIntegrationTest(_x3, _x4, _x5, _x6, _x7, _x8) {
  return _runIntegrationTest.apply(this, arguments);
}

function _runIntegrationTest() {
  _runIntegrationTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(validationFilesFolderName, validationFileName, testType, modelsToExclude, runTestForDataAndAlgorithm, t) {
    var modelsToTest;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            validationFileName;
            _context3.next = 3;
            return getModelsToTest(modelsToExclude);

          case 3:
            modelsToTest = _context3.sent;
            modelsToTest.forEach(function (_ref) {
              var model = _ref.model;
              t.test("Testing ".concat(testType, " for model ").concat(model.name), function (t) {
                var validationCsvFilePaths = [];
                var modelPredicateDatas = [];

                if (model.algorithms.length === 1) {
                  validationCsvFilePaths.push(getCsvFilePathsInFolder("".concat(constants_1.TestAlgorithmsFolderPath, "/").concat(model.name, "/validation-data/").concat(validationFilesFolderName)));
                  modelPredicateDatas.push([]);
                } else {
                  validationCsvFilePaths.push(getCsvFilePathsInFolder("".concat(constants_1.TestAlgorithmsFolderPath, "/").concat(model.name, "/validation-data/").concat(validationFilesFolderName, "/male")));
                  modelPredicateDatas.push([{
                    name: 'sex',
                    coefficent: 'male'
                  }]);
                  validationCsvFilePaths.push(getCsvFilePathsInFolder("".concat(constants_1.TestAlgorithmsFolderPath, "/").concat(model.name, "/validation-data/").concat(validationFilesFolderName, "/female")));
                  modelPredicateDatas.push([{
                    name: 'sex',
                    coefficent: 'female'
                  }]);
                }

                modelPredicateDatas.forEach(function (currentModelPredicateData, index) {
                  var algorithm = model.getAlgorithmForData(currentModelPredicateData); // tslint:disable-next-line:no-shadowed-variable

                  t.test("Testing ".concat(testType, " for algorithm ").concat(algorithm.name), function (t) {
                    validationCsvFilePaths[index].forEach(function (validationCsvFilePath) {
                      testValidationFile(validationCsvFilePath, algorithm, runTestForDataAndAlgorithm, testType, t);
                    });
                  });
                });
              });
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _runIntegrationTest.apply(this, arguments);
}

exports.runIntegrationTest = runIntegrationTest;

function getCsvFilePathsInFolder(folderPath) {
  return fs.readdirSync(folderPath).filter(function (fileOrFolderName) {
    var fileOrFolderPath = "".concat(folderPath, "/").concat(fileOrFolderName);

    if (fs.statSync("".concat(folderPath, "/").concat(fileOrFolderName)).isFile()) {
      if (path.parse(fileOrFolderPath).ext === '.csv') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }).map(function (csvFileName) {
    return "".concat(folderPath, "/").concat(csvFileName);
  });
}

function testValidationFile(validationCsvFilePath, algorithm, runTestForDataAndAlgorithm, testType, t) {
  var fileName = path.parse(validationCsvFilePath).name;
  t.test("Testing algorithm ".concat(algorithm.name, " for ").concat(testType, " for file ").concat(fileName), function (t) {
    streamValidationCsvFile(validationCsvFilePath, function (data, currentIndex) {
      return runTestForDataAndAlgorithm(algorithm, data, currentIndex);
    }, function () {
      t.pass("".concat(testType, " validated for algorithm ").concat(algorithm.name, " for file ").concat(fileName));
      t.end();
    }, function (err) {
      t.end(err);
    });
  });
}
//# sourceMappingURL=test-utils.js.map