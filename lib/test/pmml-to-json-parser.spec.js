"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var test_utils_1 = require("./test-utils");

var pmml_1 = require("../parsers/pmml-to-json-parser/pmml");

var chai_1 = require("chai");

var lodash_1 = require("lodash");

function doTableAssertions(actualModelJson, tables, t) {
  tables.forEach(function (table) {
    table.rows.forEach(function (row, index) {
      chai_1.expect(actualModelJson.algorithms[0].algorithm.tables[table.name][index]).to.deep.equal(lodash_1.omit(row, 'columnTwo'));
    });
  });
  t.pass("Tables are correctly set");
}

test("Parsing PMML to JSON",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(t) {
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
            pmmlString = test_utils_1.getPmmlString(DerivedFields, Tables);
            _context.next = 5;
            return pmml_1.pmmlXmlStringsToJson([[pmmlString]], []);

          case 5:
            model = _context.sent;
            doTableAssertions(model, Tables, t);
            t.end();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=pmml-to-json-parser.spec.js.map