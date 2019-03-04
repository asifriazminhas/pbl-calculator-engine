"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var pmml_1 = require("../parsers/pmml");

var derived_field_1 = require("../parsers/pmml-to-json-parser/data_fields/derived_field/derived_field");

var chai_1 = require("chai");

process.on('unhandledRejection', function (error) {
  console.error(error);
});

function getPmmlForTest(_x) {
  return _getPmmlForTest.apply(this, arguments);
}

function _getPmmlForTest() {
  _getPmmlForTest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref) {
    var tableName, derivedFieldName, outputColumn, fieldColumnPairs, fieldColumnPairsString, pmmlString;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            tableName = _ref.tableName, derivedFieldName = _ref.derivedFieldName, outputColumn = _ref.outputColumn, fieldColumnPairs = _ref.fieldColumnPairs;
            fieldColumnPairsString = fieldColumnPairs.map(function (fieldColumnPair) {
              var fieldOrConstantString = fieldColumnPair.field ? "field=\"".concat(fieldColumnPair.field, "\"") : "constant=\"".concat(fieldColumnPair.constant, "\"");
              return "<FieldColumnPair column=\"".concat(fieldColumnPair.column, "\" ").concat(fieldOrConstantString, " />");
            }).join('');
            pmmlString = "<PMML>\n        <DataDictionary>\n            <DataField name=\"dataFieldOne\"/>\n            <DataField name=\"dataFieldTwo\"/>\n        </DataDictionary>\n        <LocalTransformations>\n            <DerivedField name=\"".concat(derivedFieldName, "\" optype=\"continuous\">\n                <MapValues outputColumn=\"").concat(outputColumn, "\">\n                    ").concat(fieldColumnPairsString, "\n                    <TableLocator location=\"taxonomy\" name=\"").concat(tableName, "\"/>\n                </MapValues>\n            </DerivedField>\n        </LocalTransformations>\n    </PMML>");
            _context3.next = 5;
            return pmml_1.PmmlParser.parsePmmlFromPmmlXmlStrings([pmmlString]);

          case 5:
            return _context3.abrupt("return", _context3.sent);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _getPmmlForTest.apply(this, arguments);
}

function doAssertions(t, derivedFieldsToTest, fieldColumnPairs, tableName, outputColumn) {
  chai_1.expect(derivedFieldsToTest.length).to.equal(1);
  t.pass("Returned expected number of derived fields");
  chai_1.expect(derivedFieldsToTest[0].derivedFrom.map(function (dataField) {
    return dataField.name;
  })).to.eql(fieldColumnPairs.map(function (fieldColumnPair) {
    return fieldColumnPair.field;
  }).filter(function (derivedFrom) {
    return derivedFrom !== undefined;
  }));
  t.pass("derivedFrom field is correctly set");
  var objectToPassIn = fieldColumnPairs.map(function (fieldColumnPair) {
    return "".concat(fieldColumnPairs.length > 1 ? '' : ' ').concat(fieldColumnPairs.length > 1 ? '\n    ' : '', "'").concat(fieldColumnPair.column, "': ").concat(fieldColumnPair.field ? "obj['".concat(fieldColumnPair.field, "']").concat(fieldColumnPairs.length > 1 ? '' : ' ') : "'".concat(fieldColumnPair.constant, "'").concat(fieldColumnPairs.length > 1 ? '\n' : ''));
  }).join(',');
  chai_1.expect(derivedFieldsToTest[0].equation).to.equal("derived = getValueFromTable(tables['".concat(tableName, "'], '").concat(outputColumn, "', {").concat(objectToPassIn, "});"));
  t.pass("equation field is correctly set");
}

function testMultipleFieldColumnPair(_x2) {
  return _testMultipleFieldColumnPair.apply(this, arguments);
}

function _testMultipleFieldColumnPair() {
  _testMultipleFieldColumnPair = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(t) {
    var derivedFieldName, tableName, outputColumn, fieldColumnPairs, pmml, derivedFields;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            derivedFieldName = 'derivedFieldTestTwo';
            tableName = 'testTableTwo';
            outputColumn = 'testTwoOutputColumn';
            fieldColumnPairs = [{
              column: 'sex',
              field: 'sexTwo'
            }, {
              column: 'age',
              constant: '2'
            }];
            _context4.next = 6;
            return getPmmlForTest({
              derivedFieldName: derivedFieldName,
              tableName: tableName,
              outputColumn: outputColumn,
              fieldColumnPairs: fieldColumnPairs
            });

          case 6:
            pmml = _context4.sent;
            derivedFields = derived_field_1.parseDerivedFields(pmml, []);
            doAssertions(t, derivedFields, fieldColumnPairs, tableName, outputColumn);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _testMultipleFieldColumnPair.apply(this, arguments);
}

function testSingleFieldColumnPair(_x3) {
  return _testSingleFieldColumnPair.apply(this, arguments);
}

function _testSingleFieldColumnPair() {
  _testSingleFieldColumnPair = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(t) {
    var derivedFieldName, tableName, outputColumn, fieldColumnPairs, pmml, derivedFields;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            derivedFieldName = 'derivedFieldTestOne';
            tableName = 'SodiumData';
            outputColumn = 'sodiumPerServing';
            fieldColumnPairs = [{
              column: 'sex',
              field: 'sex'
            }];
            _context5.next = 6;
            return getPmmlForTest({
              derivedFieldName: derivedFieldName,
              tableName: tableName,
              outputColumn: outputColumn,
              fieldColumnPairs: fieldColumnPairs
            });

          case 6:
            pmml = _context5.sent;
            derivedFields = derived_field_1.parseDerivedFields(pmml, []);
            doAssertions(t, derivedFields, fieldColumnPairs, tableName, outputColumn);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _testSingleFieldColumnPair.apply(this, arguments);
}

test("Parsing derived field from PMML", function (t) {
  t.test("Testing single FieldColumnPairs",
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return testSingleFieldColumnPair(t);

            case 2:
              t.end();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.test("Testing multiple FieldColumnPairs",
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return testMultipleFieldColumnPair(t);

            case 2:
              t.end();

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }());
});
//# sourceMappingURL=pmml-derived-field-parsing.spec.js.map