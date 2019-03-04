"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var chai_1 = require("chai");

var derived_field_1 = require("../engine/data-field/derived-field/derived-field");

var data_field_1 = require("../engine/data-field/data-field");

test(".calculateCoefficent", function (t) {
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
  var derivedField = new derived_field_1.DerivedField({
    name: 'derivedField',
    equation: "derived = getValueFromTable(\n            tables['".concat(tableName, "'],\n            '").concat(outputColumn, "', {\n                'columnOne': obj['fieldOne'],\n                'columnTwo': 'b'\n            },\n        )"),
    derivedFrom: [],
    isRequired: false,
    metadata: metadata
  }, [new data_field_1.DataField({
    name: 'fieldOne',
    isRequired: false,
    metadata: metadata
  })]);
  var data = [{
    name: 'fieldOne',
    coefficent: 'a'
  }];
  chai_1.expect(derivedField.calculateCoefficent(data, userFunctions, tables)).to.equal('1');
  t.pass("Correctly calculated coefficent with table condition");
  t.end();
});
test(".getDerivedFieldWithName", function (t) {
  var metadata = {
    label: '',
    shortLabel: ''
  };
  var childFields = [new derived_field_1.DerivedField({
    equation: '',
    name: '',
    derivedFrom: [],
    isRequired: false,
    metadata: metadata
  }, [new derived_field_1.DerivedField({
    equation: '',
    derivedFrom: [],
    name: 'fieldToFind',
    isRequired: false,
    metadata: metadata
  }, [new derived_field_1.DerivedField({
    equation: '',
    derivedFrom: [],
    name: '',
    isRequired: false,
    metadata: metadata
  }, [])])]), new derived_field_1.DerivedField({
    name: '',
    equation: '',
    derivedFrom: [],
    isRequired: false,
    metadata: metadata
  }, [])];
  var derivedField = new derived_field_1.DerivedField({
    equation: '',
    derivedFrom: [],
    name: '',
    isRequired: false,
    metadata: metadata
  }, childFields);
  chai_1.expect(derived_field_1.findDescendantDerivedField(derivedField, childFields[0].derivedFrom[0].name)).to.eql(childFields[0].derivedFrom[0]);
  t.pass("Returned right derived field");
  t.end();
});
test(".calculateDataToCalculateCoefficent", function (t) {
  t.test("When the derived from item is a DataField", function (t) {
    var metadata = {
      label: '',
      shortLabel: ''
    };
    var derivedFromDataField = new data_field_1.DataField({
      name: 'testOne',
      isRequired: false,
      metadata: metadata
    });
    var derivedField = new derived_field_1.DerivedField({
      name: '',
      equation: '',
      derivedFrom: [],
      isRequired: false,
      metadata: metadata
    }, [derivedFromDataField]);
    t.test("When the DataField is not in the data argument", function (t) {
      var actualData = derivedField.calculateDataToCalculateCoefficent([], {}, {});
      chai_1.expect(actualData).to.deep.equal([{
        name: derivedFromDataField.name,
        coefficent: undefined
      }]);
      t.pass("Returned Data object has a Datum object for the derived from DataField correctly set");
      t.end();
    });
  });
});
//# sourceMappingURL=derived-field.spec.js.map