"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var test = _interopRequireWildcard(require("tape"));

var _testUtils = require("./test-utils");

var _pmml = require("../parsers/pmml-to-json-parser/pmml");

var _chai = require("chai");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function doTableAssertions(actualModelJson, tables, t) {
  tables.forEach(function (table) {
    table.rows.forEach(function (row, index) {
      (0, _chai.expect)(actualModelJson.algorithms[0].algorithm.tables[table.name][index]).to.deep.equal((0, _omit2.default)(row, 'columnTwo'));
    });
  });
  t.pass("Tables are correctly set");
}

test.skip("Parsing PMML to JSON", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    var Tables, DerivedFields, pmmlString, model;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Tables = [{
              name: 'tableOne',
              rows: [{
                outputColumn: String(Math.random()),
                columnOne: String(Math.random()),
                columnTwo: String(Math.random())
              }, {
                outputColumn: String(Math.random()),
                columnOne: String(Math.random()),
                columnTwo: String(Math.random())
              }]
            }];
            DerivedFields = [{
              name: 'derivedFieldOne',
              mapValues: {
                tableName: Tables[0].name,
                outputColumn: 'outputColumn',
                fieldColumnPairs: [{
                  column: 'columnOne',
                  constant: '1'
                }]
              }
            }];
            pmmlString = (0, _testUtils.getPmmlString)(DerivedFields, Tables);
            _context.next = 5;
            return (0, _pmml.pmmlXmlStringsToJson)([[pmmlString]], []);

          case 5:
            model = _context.sent;
            doTableAssertions(model, Tables, t);
            t.end();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=pmml-to-json-parser.spec.js.map