"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var covariate_1 = require("./data_fields/covariate");

var derived_field_1 = require("./data_fields/derived_field/derived_field");

var pmml_1 = require("../pmml");

var define_function_1 = require("./define-function/define-function");

var taxonomy_1 = require("./taxonomy");

var optimizations_1 = require("./optimizations");

var undefined_1 = require("../../util/undefined/undefined");

var time_metric_1 = require("../../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric");

function parseBaselineFromPmmlXml(generalRegressionModel) {
  return Number(generalRegressionModel.$.baselineHazard);
}

function pmmlStringsToJson(_x) {
  return _pmmlStringsToJson.apply(this, arguments);
}

function _pmmlStringsToJson() {
  _pmmlStringsToJson = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pmmlXmlStrings) {
    var pmml, allDefineFunctionNames, generalRegressionModel, baseAlgorithm;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return pmml_1.PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);

          case 2:
            pmml = _context.sent;
            allDefineFunctionNames = undefined_1.returnEmptyArrayIfUndefined(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction).map(function (defineFunction) {
              return defineFunction.$.name;
            });
            generalRegressionModel = pmml.pmmlXml.PMML.GeneralRegressionModel;
            baseAlgorithm = {
              name: pmml.pmmlXml.PMML.Header.Extension.value,
              derivedFields: derived_field_1.parseDerivedFields(pmml, allDefineFunctionNames),
              userFunctions: undefined_1.returnEmptyArrayIfUndefined(pmml.pmmlXml.PMML.LocalTransformations.DefineFunction).map(function (defineFunction) {
                return define_function_1.parseDefineFunction(defineFunction, allDefineFunctionNames);
              }).reduce(function (userFunctionObj, currentObject) {
                return Object.assign({}, userFunctionObj, currentObject);
              }, {}),
              tables: taxonomy_1.parseTaxonomy(pmml.pmmlXml.PMML.Taxonomy),
              baseline: parseBaselineFromPmmlXml(generalRegressionModel),
              covariates: covariate_1.parseCovariates(pmml),
              timeMetric: parseTimeMetric(generalRegressionModel),
              maximumTime: Number(generalRegressionModel.Extension.find(function (extension) {
                return extension.name === 'maximumTime';
              }).value)
            };
            return _context.abrupt("return", baseAlgorithm);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _pmmlStringsToJson.apply(this, arguments);
}

function pmmlXmlStringsToJson(_x2, _x3) {
  return _pmmlXmlStringsToJson.apply(this, arguments);
}

function _pmmlXmlStringsToJson() {
  _pmmlXmlStringsToJson = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(modelPmmlXmlStrings, predicates) {
    var parsedAlgorithms, modelJson;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Promise.all(modelPmmlXmlStrings.map(function (pmmlXmlStrings) {
              return pmmlStringsToJson(pmmlXmlStrings);
            }));

          case 2:
            parsedAlgorithms = _context2.sent;
            modelJson = {
              name: '',
              algorithms: parsedAlgorithms.map(function (currentParsedAlgorithm, index) {
                return {
                  algorithm: currentParsedAlgorithm,
                  predicate: predicates[index]
                };
              })
            };
            return _context2.abrupt("return", optimizations_1.optimizeModel(modelJson));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _pmmlXmlStringsToJson.apply(this, arguments);
}

exports.pmmlXmlStringsToJson = pmmlXmlStringsToJson;

function parseTimeMetric(generalRegressionModel) {
  var pmmlTimeMetric = generalRegressionModel.Extension.find(function (_ref) {
    var name = _ref.name;
    return name === 'timeMetric';
  }).value;

  switch (pmmlTimeMetric) {
    case 'days':
      {
        return time_metric_1.TimeMetric.Days;
      }

    case 'years':
      {
        return time_metric_1.TimeMetric.Years;
      }

    default:
      {
        throw new Error("Unknown time metric extension value ".concat(pmmlTimeMetric));
      }
  }
}
//# sourceMappingURL=pmml.js.map