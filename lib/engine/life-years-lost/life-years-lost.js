"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = require("tslib");

var core_decorators_1 = require("core-decorators");

var data_1 = require("../data/data");

var gender_cause_effect_ref_1 = require("../cause-effect/gender-cause-effect-ref");

var LifeYearsLost =
/*#__PURE__*/
function () {
  function LifeYearsLost(causeEffectRef, lifeTable) {
    _classCallCheck(this, LifeYearsLost);

    this.causeEffectRef = causeEffectRef;
    this.lifeTable = lifeTable;
  }

  _createClass(LifeYearsLost, [{
    key: "getLifeYearsLostDueToRiskFactor",
    value: function getLifeYearsLostDueToRiskFactor(riskFactor, data) {
      var ageDatum = data_1.findDatumWithName('age', data); // Calculate Normal LE

      var normalLifeExpectancy = this.lifeTable.getLifeExpectancy(data); // Calculate Cause Deleted LE

      /* We concat the age datum at the end since some covariates may need it
      for their calculations and so it will get removed from the data but we
      need it for life expectancy calculations */

      var lifeExpectancyDataWithoutRiskFactorFields = data_1.filterDataUsedToCalculateCoefficientsForCovariateGroup(riskFactor, this.lifeTable.model.getAlgorithmForData(data), data).concat(ageDatum);
      /* Add the cause deleted ref to the filtered data */

      var causeDeletedLifeExpectancyData = lifeExpectancyDataWithoutRiskFactorFields.concat(gender_cause_effect_ref_1.getCauseEffectRefForData(this.causeEffectRef, data)[riskFactor]);
      /* Use the new data to calculate cause deleted LE */

      var causeDeletedLifeExpectancy = this.lifeTable.getLifeExpectancy(causeDeletedLifeExpectancyData); // Return subtraction of the two

      return causeDeletedLifeExpectancy - normalLifeExpectancy;
    }
  }]);

  return LifeYearsLost;
}();

LifeYearsLost = tslib_1.__decorate([core_decorators_1.autobind], LifeYearsLost);
exports.LifeYearsLost = LifeYearsLost;
//# sourceMappingURL=life-years-lost.js.map