"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var chai_1 = require("chai");

var data_field_type_1 = require("../parsers/json/data-field-type");

var moment = require("moment");
/* tslint:disable-next-line */


var non_interaction_covariate_1 = require("../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var time_metric_1 = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric"); // tslint:disable-next-line:max-line-length


var cox_survival_algorithm_1 = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");

test("getSurvivalToTimeForCoxWithBins function", function (t) {
  var covariate = new non_interaction_covariate_1.NonInteractionCovariate({
    dataFieldType: data_field_type_1.DataFieldType.NonInteractionCovariate,
    beta: 10,
    referencePoint: undefined,
    name: 'covariateOne',
    groups: [],
    isRequired: false,
    metadata: {
      label: '',
      shortLabel: ''
    }
  }, undefined, undefined);
  var maximumTime = 1800;
  var coxWithBinsJson = {
    timeMetric: time_metric_1.TimeMetric.Days,
    maximumTime: 1800,
    name: '',
    userFunctions: {},
    tables: {},
    covariates: [],
    baseline: 1,
    derivedFields: [],
    bins: {
      binsData: {
        5: [{
          survivalPercent: 100,
          time: 0
        }, {
          survivalPercent: 50,
          time: maximumTime / 2
        }, {
          survivalPercent: 49,
          time: maximumTime / 2
        }, {
          survivalPercent: 5,
          time: maximumTime
        }]
      },
      binsLookup: [{
        minScore: 0,
        maxScore: 20,
        binNumber: 5
      }]
    }
  };
  var coxWithBins = new cox_survival_algorithm_1.CoxSurvivalAlgorithm(coxWithBinsJson);
  var data = [{
    name: covariate.name,
    coefficent: 1
  }];
  var time = moment();
  time.add('days', maximumTime / 2);
  chai_1.expect(coxWithBins.getSurvivalToTime(data, time), "Invalid survival value returned").to.equal(0.49);
  t.pass("Survival correctly calculated");
  t.end();
});
//# sourceMappingURL=cox.spec.js.map