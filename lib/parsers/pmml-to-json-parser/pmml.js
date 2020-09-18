"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pmmlXmlStringsToJson = pmmlXmlStringsToJson;

var _uniqBy2 = _interopRequireDefault(require("lodash/uniqBy"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _uniq2 = _interopRequireDefault(require("lodash/uniq"));

var _covariate = require("./data_fields/covariate");

var _derived_field = require("./data_fields/derived_field/derived_field");

var _pmml = require("../pmml");

var _defineFunction = require("./define-function/define-function");

var _taxonomy = require("./taxonomy");

var _optimizations = require("./optimizations");

var _undefined = require("../../util/undefined/undefined");

var _jsonCoxSurvivalAlgorithm = require("../../parsers/json/json-cox-survival-algorithm");

var _timeMetric = require("../../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric");

var _data_field = require("./data_fields/data_field");

var _algorithmType = require("../json/algorithm-type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function parseBaselineFromPmmlXml(generalRegressionModel) {
  return Number(generalRegressionModel.$.baselineHazard);
}

function pmmlStringsToJson(_x) {
  return _pmmlStringsToJson.apply(this, arguments);
}

function _pmmlStringsToJson() {
  _pmmlStringsToJson = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pmmlXmlStrings) {
    var pmml, allDefineFunctionNames, generalRegressionModel, baseAlgorithm, fullAlgorithm, modelFields, allAlgorithmFields;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _pmml.PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);

          case 2:
            pmml = _context.sent;
            allDefineFunctionNames = (0, _undefined.returnEmptyArrayIfUndefined)(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction).map(function (defineFunction) {
              return defineFunction.$.name;
            });
            generalRegressionModel = pmml.pmmlXml.PMML.GeneralRegressionModel;
            baseAlgorithm = {
              name: pmml.pmmlXml.PMML.Header.Extension.value,
              derivedFields: (0, _derived_field.parseDerivedFields)(pmml, allDefineFunctionNames),
              userFunctions: (0, _undefined.returnEmptyArrayIfUndefined)(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction).map(function (defineFunction) {
                return (0, _defineFunction.parseDefineFunction)(defineFunction, allDefineFunctionNames);
              }).reduce(function (userFunctionObj, currentObject) {
                return Object.assign({}, userFunctionObj, currentObject);
              }, {}),
              tables: (0, _taxonomy.parseTaxonomy)(pmml.pmmlXml.PMML.Taxonomy)
            };

            if (pmml.pmmlXml.PMML.SimpleModel) {
              fullAlgorithm = Object.assign({
                algorithmType: _algorithmType.AlgorithmType.SimpleAlgorithm,
                output: pmml.pmmlXml.PMML.Output.OutputField.$.name
              }, baseAlgorithm);
            } else {
              fullAlgorithm = Object.assign({
                algorithmType: _algorithmType.AlgorithmType.CoxSurvivalAlgorithm,
                baseline: parseBaselineFromPmmlXml(generalRegressionModel),
                covariates: (0, _covariate.parseCovariates)(pmml),
                timeMetric: parseTimeMetric(generalRegressionModel),
                maximumTime: Number(generalRegressionModel.Extension.find(function (extension) {
                  return extension.name === 'maximumTime';
                }).value)
              }, baseAlgorithm);
            }

            modelFields = [];

            if (fullAlgorithm.algorithmType === _algorithmType.AlgorithmType.CoxSurvivalAlgorithm) {
              allAlgorithmFields = (0, _uniq2.default)((0, _flatten2.default)((0, _jsonCoxSurvivalAlgorithm.parseCoxSurvivalAlgorithmJson)(fullAlgorithm).covariates.map(function (covariate) {
                return covariate.getDescendantFields().map(function (field) {
                  return field.name;
                }).concat(covariate.name);
              })));
              modelFields = pmml.pmmlXml.PMML.DataDictionary.DataField.filter(function (dataField) {
                return allAlgorithmFields.indexOf(dataField.$.name) === -1;
              }).map(function (modelField) {
                return (0, _data_field.parseDataFieldFromDataFieldPmmlNode)(modelField);
              });
            }

            return _context.abrupt("return", {
              algorithm: fullAlgorithm,
              modelFields: modelFields
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _pmmlStringsToJson.apply(this, arguments);
}

function pmmlXmlStringsToJson(_x2, _x3) {
  return _pmmlXmlStringsToJson.apply(this, arguments);
}

function _pmmlXmlStringsToJson() {
  _pmmlXmlStringsToJson = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(modelPmmlXmlStrings, predicates) {
    var parsedAlgorithmAndModelFields, modelFields, modelJson;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Promise.all(modelPmmlXmlStrings.map(function (pmmlXmlStrings) {
              return pmmlStringsToJson(pmmlXmlStrings);
            }));

          case 2:
            parsedAlgorithmAndModelFields = _context2.sent;
            modelFields = (0, _uniqBy2.default)((0, _flatten2.default)(parsedAlgorithmAndModelFields.map(function (parsedAlgorithmAndModelField) {
              return parsedAlgorithmAndModelField.modelFields;
            })), function (_ref2) {
              var name = _ref2.name;
              return name;
            });
            modelJson = {
              name: '',
              algorithms: parsedAlgorithmAndModelFields.map(function (_ref3, index) {
                var algorithm = _ref3.algorithm;
                return {
                  algorithm: algorithm,
                  predicate: predicates[index]
                };
              }),
              modelFields: modelFields
            };
            return _context2.abrupt("return", (0, _optimizations.optimizeModel)(modelJson));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _pmmlXmlStringsToJson.apply(this, arguments);
}

function parseTimeMetric(generalRegressionModel) {
  var pmmlTimeMetric = generalRegressionModel.Extension.find(function (_ref) {
    var name = _ref.name;
    return name === 'timeMetric';
  }).value;

  switch (pmmlTimeMetric) {
    case 'days':
      {
        return _timeMetric.TimeMetric.Days;
      }

    case 'years':
      {
        return _timeMetric.TimeMetric.Years;
      }

    default:
      {
        throw new Error("Unknown time metric extension value ".concat(pmmlTimeMetric));
      }
  }
}
//# sourceMappingURL=pmml.js.map