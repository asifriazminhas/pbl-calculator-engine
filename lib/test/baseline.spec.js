"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var chai_1 = require("chai");

var no_baseline_hazard_found_1 = require("../engine/errors/no-baseline-hazard-found");

var baseline_1 = require("../engine/algorithm/regression-algorithm/baseline/baseline");

test("getBaselineForData function", function (t) {
  t.test("When baseline is a number", function (t) {
    var baseline = 1;
    chai_1.expect(new baseline_1.Baseline(baseline).getBaselineForData([])).to.equal(baseline);
    t.pass("Should return the value of the baseline field");
    t.end();
  });
  t.test("When the baseline is an object", function (t) {
    var baseline = [{
      age: 29,
      baseline: 1
    }];
    var baselineInstance = new baseline_1.Baseline(baseline);
    t.test("When the baseline object does not have a value for the coefficient of the found age datum", function (t) {
      chai_1.expect(baselineInstance.getBaselineForData.bind(baselineInstance, [{
        name: 'age',
        coefficent: 30
      }])).to.throw(no_baseline_hazard_found_1.NoBaselineFoundForAge);
      t.pass("Should throw a NoBaselineFoundForAge error");
      t.end();
    });
    t.test("When the baseline object has a number value for the coefficient of the found age datum", function (t) {
      chai_1.expect(baselineInstance.getBaselineForData([{
        name: 'age',
        coefficent: 29
      }])).to.equal(baseline[0].baseline);
      t.pass("Should return the number value");
      t.end();
    });
  });
});
//# sourceMappingURL=baseline.spec.js.map