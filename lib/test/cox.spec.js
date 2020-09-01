"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _chai = require("chai");

var _dataFieldType = require("../parsers/json/data-field-type");

var _moment = _interopRequireDefault(require("moment"));

var _nonInteractionCovariate = require("../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var _timeMetric = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric");

var _coxSurvivalAlgorithm = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");

var _algorithmType = require("../parsers/json/algorithm-type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tslint:disable-next-line */
// tslint:disable-next-line:max-line-length
(0, _tape.default)("getSurvivalToTimeForCoxWithBins function", function (t) {
  var covariate = new _nonInteractionCovariate.NonInteractionCovariate({
    dataFieldType: _dataFieldType.DataFieldType.NonInteractionCovariate,
    beta: 10,
    referencePoint: undefined,
    name: 'covariateOne',
    groups: [],
    isRequired: false,
    isRecommended: false,
    metadata: {
      label: '',
      shortLabel: ''
    }
  }, undefined, undefined);
  var maximumTime = 1800;
  var coxWithBinsJson = {
    algorithmType: _algorithmType.AlgorithmType.CoxSurvivalAlgorithm,
    timeMetric: _timeMetric.TimeMetric.Days,
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
  var coxWithBins = new _coxSurvivalAlgorithm.CoxSurvivalAlgorithm(coxWithBinsJson);
  var data = [{
    name: covariate.name,
    coefficent: 1
  }];
  var time = (0, _moment.default)();
  time.add('days', maximumTime / 2);
  (0, _chai.expect)(coxWithBins.getSurvivalToTime(data, time), "Invalid survival value returned").to.equal(0.49);
  t.pass("Survival correctly calculated");
  t.end();
});
//# sourceMappingURL=cox.spec.js.map