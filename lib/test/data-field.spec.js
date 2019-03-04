"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var model_1 = require("../engine/model/model");

var chai_1 = require("chai");

test("Covariate", function (t) {
  var ModelJson = require('../../assets/test/model/model.json');

  var model = new model_1.Model(ModelJson);
  var CovariateToTestName = 'AgeC_rcs1';
  var covariateToTest = model.algorithms[0].algorithm.covariates.find(function (covariate) {
    return covariate.name === CovariateToTestName;
  });
  t.test("formatCoefficentForComponent", function (t) {
    t.test("When the coefficient is below the lower margin", function (t) {
      chai_1.expect(covariateToTest['formatCoefficentForComponent'](-31)).to.equal(-30.630622000000002);
      t.pass("Returns the lower margin");
      t.end();
    });
    t.test("When the coefficient is above the upper margin", function (t) {
      chai_1.expect(covariateToTest['formatCoefficentForComponent'](52)).to.equal(51.369378);
      t.pass("Returns the upper margin");
      t.end();
    });
    t.test("When the coefficient is within the margins", function (t) {
      chai_1.expect(covariateToTest['formatCoefficentForComponent'](20)).to.equal(20);
      t.pass("Returns the coefficient arg");
      t.end();
    });
  });
});
//# sourceMappingURL=data-field.spec.js.map