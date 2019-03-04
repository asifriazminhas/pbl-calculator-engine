"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var bluebird = require("bluebird");

var xml2js_1 = require("xml2js");

var pmml_1 = require("./pmml");

var data_dictionary_1 = require("./data_dictionary/data_dictionary");

var local_transformations_1 = require("./local_transformations/local_transformations");

var general_regression_model_1 = require("./general_regression_model/general_regression_model");

var promisifiedParseXmlString = bluebird.promisify(xml2js_1.parseString);

function mergePmml(pmmlOne, pmmlTwo) {
  var mergedGeneralRegressionModel = general_regression_model_1.mergeGeneralRegressionModel(pmmlOne.PMML.GeneralRegressionModel, pmmlTwo.PMML.GeneralRegressionModel);
  return Object.assign({}, pmmlOne, pmmlTwo, {
    PMML: {
      Header: Object.assign({}, pmmlOne.PMML.Header, pmmlTwo.PMML.Header),
      Output: Object.assign({}, pmmlOne.PMML.Output, pmmlTwo.PMML.Output),
      Targets: Object.assign({}, pmmlOne.PMML.Targets, pmmlTwo.PMML.Targets),
      Taxonomy: pmmlTwo.PMML.Taxonomy ? pmmlTwo.PMML.Taxonomy : pmmlOne.PMML.Taxonomy ? pmmlOne.PMML.Taxonomy : [],
      DataDictionary: data_dictionary_1.mergeDataDictionary(pmmlOne.PMML.DataDictionary, pmmlTwo.PMML.DataDictionary),
      LocalTransformations: local_transformations_1.mergeLocalTransformations(pmmlOne.PMML.LocalTransformations, pmmlTwo.PMML.LocalTransformations),
      GeneralRegressionModel: mergedGeneralRegressionModel,
      CustomPMML: Object.assign({}, pmmlOne.PMML.CustomPMML ? pmmlOne.PMML.CustomPMML : {}, pmmlTwo.PMML.CustomPMML ? pmmlTwo.PMML.CustomPMML : {}),
      MiningSchema: Object.assign({}, pmmlOne.PMML.MiningSchema, pmmlTwo.PMML.MiningSchema)
    }
  });
}

var PmmlParser =
/*#__PURE__*/
function () {
  function PmmlParser() {
    _classCallCheck(this, PmmlParser);
  }

  _createClass(PmmlParser, null, [{
    key: "parsePmmlFromPmmlXmlStrings",
    value: function () {
      var _parsePmmlFromPmmlXmlStrings = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(pmmlXmlStrings) {
        var pmmlXmls, mergedPmmlXml;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Promise.all(pmmlXmlStrings.map(function (pmmlXmlString) {
                  return promisifiedParseXmlString(pmmlXmlString, {
                    explicitArray: false,
                    explicitChildren: true,
                    preserveChildrenOrder: true
                  });
                }));

              case 2:
                pmmlXmls = _context.sent;
                mergedPmmlXml = pmmlXmls.reduce(function (mergedPmmlXml, currentPmmlXml) {
                  if (!mergedPmmlXml) {
                    return currentPmmlXml;
                  } else {
                    return mergePmml(mergedPmmlXml, currentPmmlXml);
                  }
                });
                return _context.abrupt("return", new pmml_1.Pmml(mergedPmmlXml));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parsePmmlFromPmmlXmlStrings(_x) {
        return _parsePmmlFromPmmlXmlStrings.apply(this, arguments);
      }

      return parsePmmlFromPmmlXmlStrings;
    }()
  }]);

  return PmmlParser;
}();

exports.PmmlParser = PmmlParser;
//# sourceMappingURL=parser.js.map