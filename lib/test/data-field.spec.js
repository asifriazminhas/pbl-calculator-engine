"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _model = require("../engine/model/model");

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape.default)("Covariate", function (t) {
  var ModelJson = require('../../assets/test/model/model.json');

  var model = new _model.Model(ModelJson);
  var CovariateToTestName = 'AgeC_rcs1';
  var covariateToTest = model.algorithms[0].algorithm.covariates.find(function (covariate) {
    return covariate.name === CovariateToTestName;
  });
  t.test("formatCoefficentForComponent", function (t) {
    t.test("When the coefficient is below the lower margin", function (t) {
      (0, _chai.expect)(covariateToTest['formatCoefficentForComponent'](-31)).to.equal(-31);
      t.pass("Returns the lower margin");
      t.end();
    });
    t.test("When the coefficient is above the upper margin", function (t) {
      (0, _chai.expect)(covariateToTest['formatCoefficentForComponent'](52)).to.equal(52);
      t.pass("Returns the upper margin");
      t.end();
    });
    t.test("When the coefficient is within the margins", function (t) {
      (0, _chai.expect)(covariateToTest['formatCoefficentForComponent'](20)).to.equal(20);
      t.pass("Returns the coefficient arg");
      t.end();
    });
  });
});
//# sourceMappingURL=data-field.spec.js.map