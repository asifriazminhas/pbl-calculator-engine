"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _derivedFieldUtil = require("../test-utils/derived-field-util");

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape.default)("DerivedField.calculateCoefficient", function (t) {
  t.test("should return a number if evaluated value is one, regardless of type", function (t) {
    var derivedField = (0, _derivedFieldUtil.getMockDerivedField)({
      equation: 'derived = "1"'
    });
    (0, _chai.expect)(derivedField.calculateCoefficent([], {}, {})).to.equal(1);
    t.pass("Pass");
    t.end();
  });
  t.test("should return a string if evaluated value is one", function (t) {
    var expectedCoefficient = 'string value';
    var derivedField = (0, _derivedFieldUtil.getMockDerivedField)({
      equation: "derived = \"".concat(expectedCoefficient, "\"")
    });
    (0, _chai.expect)(derivedField.calculateCoefficent([], {}, {})).to.equal(expectedCoefficient);
    t.pass('Pass');
    t.end();
  });
});
//# sourceMappingURL=calculate-coefficient.spec.js.map