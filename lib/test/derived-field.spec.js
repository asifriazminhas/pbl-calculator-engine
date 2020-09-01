"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _chai = require("chai");

var _derivedField = require("../engine/data-field/derived-field/derived-field");

var _dataField = require("../engine/data-field/data-field");

var _derivedFieldDepGraph = require("../covariate-dep-graph/derived-field-dep-graph");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _tape.default)(".calculateCoefficent", function (t) {
  var userFunctions = {};
  var tableName = 'tableOne';
  var outputColumn = 'out';

  var tables = _defineProperty({}, tableName, [_defineProperty({
    columnOne: 'a',
    columnTwo: 'b'
  }, outputColumn, '1'), _defineProperty({
    columnOne: 'c',
    columnTwo: 'd'
  }, outputColumn, '2')]);

  var metadata = {
    label: '',
    shortLabel: ''
  };
  var derivedField = new _derivedField.DerivedField({
    name: 'derivedField',
    equation: "derived = getValueFromTable(\n            tables['".concat(tableName, "'],\n            '").concat(outputColumn, "', {\n                'columnOne': obj['fieldOne'],\n                'columnTwo': 'b'\n            },\n        )"),
    derivedFrom: [],
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, [new _dataField.DataField({
    name: 'fieldOne',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  })]);
  var data = [{
    name: 'fieldOne',
    coefficent: 'a'
  }];
  (0, _chai.expect)(derivedField.calculateCoefficent(data, userFunctions, tables)).to.equal(1);
  t.pass("Correctly calculated coefficent with table condition");
  t.end();
});
(0, _tape.default)(".getDerivedFieldWithName", function (t) {
  var metadata = {
    label: '',
    shortLabel: ''
  };
  var childFields = [new _derivedField.DerivedField({
    equation: '',
    name: '',
    derivedFrom: [],
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, [new _derivedField.DerivedField({
    equation: '',
    derivedFrom: [],
    name: 'fieldToFind',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, [new _derivedField.DerivedField({
    equation: '',
    derivedFrom: [],
    name: '',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, [])])]), new _derivedField.DerivedField({
    name: '',
    equation: '',
    derivedFrom: [],
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, [])];
  var derivedField = new _derivedField.DerivedField({
    equation: '',
    derivedFrom: [],
    name: '',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, childFields);
  (0, _chai.expect)((0, _derivedFieldDepGraph.findDescendantDerivedField)(derivedField, childFields[0].derivedFrom[0].name)).to.eql(childFields[0].derivedFrom[0]);
  t.pass("Returned right derived field");
  t.end();
});
(0, _tape.default)(".calculateDataToCalculateCoefficent", function (t) {
  t.test("When the derived from item is a DataField", function (t) {
    var metadata = {
      label: '',
      shortLabel: ''
    };
    var derivedFromDataField = new _dataField.DataField({
      name: 'testOne',
      isRequired: false,
      isRecommended: false,
      metadata: metadata
    });
    var derivedField = new _derivedField.DerivedField({
      name: '',
      equation: '',
      derivedFrom: [],
      isRequired: false,
      isRecommended: false,
      metadata: metadata
    }, [derivedFromDataField]);
    t.test("When the DataField is not in the data argument", function (t) {
      var actualData = derivedField.calculateDataToCalculateCoefficent([], {}, {});
      (0, _chai.expect)(actualData).to.deep.equal([{
        name: derivedFromDataField.name,
        coefficent: undefined
      }]);
      t.pass("Returned Data object has a Datum object for the derived from DataField correctly set");
      t.end();
    });
  });
});
//# sourceMappingURL=derived-field.spec.js.map