"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _chai = require("chai");

var _taxonomy = require("../parsers/pmml-to-json-parser/taxonomy");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _xml2js = require("xml2js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var promisifiedParseXmlString = _bluebird.default.promisify(_xml2js.parseString);

(0, _tape.default)("Testing parsing PMML Taxonomy", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    var TaxonomyPmml, pmml, taxonomyPmml, parsedTaxonomy, tableNames;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            TaxonomyPmml = "\n    <PMML>\n        <Taxonomy name=\"TestOne\">\n            <InlineTable>\n                <row>\n                    <columnOne>A</columnOne>\n                    <columnTwo>B</columnTwo>\n                </row>\n                <row>\n                    <columnOne>C</columnOne>\n                    <columnTwo>D</columnTwo>\n                </row>\n            </InlineTable>\n        </Taxonomy>\n        <Taxonomy name=\"TestTwo\">\n            <InlineTable>\n                <row>\n                    <columnOne>E</columnOne>\n                    <columnTwo>F</columnTwo>\n                </row>\n            </InlineTable>\n        </Taxonomy>\n    </PMML>\n    ";
            _context.next = 3;
            return promisifiedParseXmlString(TaxonomyPmml, {
              explicitArray: false,
              explicitChildren: true,
              preserveChildrenOrder: true
            });

          case 3:
            pmml = _context.sent;
            taxonomyPmml = pmml.PMML.Taxonomy;
            parsedTaxonomy = (0, _taxonomy.parseTaxonomy)(pmml.PMML.Taxonomy);
            tableNames = Object.keys(parsedTaxonomy);
            (0, _chai.expect)(tableNames).to.eql([taxonomyPmml[0].$.name, taxonomyPmml[1].$.name]);
            t.pass("Table names are correctly set");
            (0, _chai.expect)(parsedTaxonomy[tableNames[0]]).to.eql([{
              columnOne: 'A',
              columnTwo: 'B'
            }, {
              columnOne: 'C',
              columnTwo: 'D'
            }]);
            (0, _chai.expect)(parsedTaxonomy[tableNames[1]]).to.eql([{
              columnOne: 'E',
              columnTwo: 'F'
            }]);
            t.pass("Table values are correctly set");
            (0, _chai.expect)((0, _taxonomy.parseTaxonomy)(undefined)).to.eql({});
            t.pass("Empty obnject returned when taxonomy is undefined");
            t.end();

          case 15:
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
//# sourceMappingURL=taxonomy.spec.js.map