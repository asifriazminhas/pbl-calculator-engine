"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifeYearsLost = void 0;

var _autobind2 = _interopRequireDefault(require("core-decorators/lib/autobind"));

var _tslib = require("tslib");

var _data = require("../data/data");

var _genderCauseEffectRef = require("../cause-effect/gender-cause-effect-ref");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LifeYearsLost = /*#__PURE__*/function () {
  function LifeYearsLost(causeEffectRef, lifeTable) {
    _classCallCheck(this, LifeYearsLost);

    this.causeEffectRef = causeEffectRef;
    this.lifeTable = lifeTable;
  }

  _createClass(LifeYearsLost, [{
    key: "getLifeYearsLostDueToRiskFactor",
    value: function getLifeYearsLostDueToRiskFactor(riskFactor, data) {
      var ageDatum = (0, _data.findDatumWithName)('age', data); // Calculate Normal LE

      var normalLifeExpectancy = this.lifeTable.getLifeExpectancy(data); // Calculate Cause Deleted LE

      /* We concat the age datum at the end since some covariates may need it
      for their calculations and so it will get removed from the data but we
      need it for life expectancy calculations */

      var lifeExpectancyDataWithoutRiskFactorFields = (0, _data.filterDataUsedToCalculateCoefficientsForCovariateGroup)(riskFactor, this.lifeTable.model.getAlgorithmForData(data), data).concat(ageDatum);
      /* Add the cause deleted ref to the filtered data */

      var causeDeletedLifeExpectancyData = lifeExpectancyDataWithoutRiskFactorFields.concat((0, _genderCauseEffectRef.getCauseEffectRefForData)(this.causeEffectRef, data)[riskFactor]);
      /* Use the new data to calculate cause deleted LE */

      var causeDeletedLifeExpectancy = this.lifeTable.getLifeExpectancy(causeDeletedLifeExpectancyData); // Return subtraction of the two

      return causeDeletedLifeExpectancy - normalLifeExpectancy;
    }
  }]);

  return LifeYearsLost;
}();

exports.LifeYearsLost = LifeYearsLost;
exports.LifeYearsLost = LifeYearsLost = (0, _tslib.__decorate)([_autobind2.default], LifeYearsLost);
//# sourceMappingURL=life-years-lost.js.map