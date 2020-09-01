"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMockDerivedField = getMockDerivedField;

var _derivedField = require("../../engine/data-field/derived-field/derived-field");

function getMockDerivedField(overrideFields) {
  var derivedFrom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var defaultJson = {
    name: 'test-derived-field',
    derivedFrom: [],
    equation: 'derived = "Test derived field output"',
    isRequired: false,
    isRecommended: false,
    metadata: {
      label: 'test-label',
      shortLabel: 'test-short-label'
    }
  };
  return new _derivedField.DerivedField(Object.assign({}, defaultJson, overrideFields), derivedFrom);
}
//# sourceMappingURL=derived-field-util.js.map