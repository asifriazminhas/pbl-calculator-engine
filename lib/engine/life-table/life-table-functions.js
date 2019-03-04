"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = require("tslib");

var life_table_1 = require("./life-table");

var life_expectancy_1 = require("./life-expectancy");

var survival_to_age_1 = require("./survival-to-age");

var data_1 = require("../data");

var errors_1 = require("../errors");

var core_decorators_1 = require("core-decorators");

var memoize_one_1 = require("memoize-one");

var LifeTableFunctions =
/*#__PURE__*/
function () {
  function LifeTableFunctions(model, genderSpecificRefLifeTable) {
    var _this = this;

    var useExFromAge = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 99;

    _classCallCheck(this, LifeTableFunctions);

    this.getCompleteLifeTable = memoize_one_1.default(function (data) {
      return life_table_1.getCompleteLifeTableForDataUsingAlgorithm(_this.getRefLifeTable(data), data, _this.model.getAlgorithmForData(data), _this.useExFromAge);
    });
    this.model = model;
    this.genderSpecificRefLifeTable = genderSpecificRefLifeTable;
    this.useExFromAge = useExFromAge;
  }

  _createClass(LifeTableFunctions, [{
    key: "getLifeExpectancy",
    value: function getLifeExpectancy(data) {
      var algorithm = this.model.getAlgorithmForData(data);

      if ('bins' in algorithm && algorithm.bins !== undefined) {
        var binData = algorithm.bins.getBinDataForScore(algorithm.calculateScore(data));
        return binData.find(function (binDatum) {
          return binDatum.survivalPercent === 50;
        }).time;
      } else {
        return life_expectancy_1.getLifeExpectancyForAge(Number(data_1.findDatumWithName('age', data).coefficent), this.getCompleteLifeTable(data));
      }
    }
  }, {
    key: "getSurvivalToAge",
    value: function getSurvivalToAge(data, toAge) {
      return survival_to_age_1.getSurvivalToAge(this.getCompleteLifeTable(data), toAge);
    }
  }, {
    key: "getRefLifeTable",
    value: function getRefLifeTable(data) {
      var sex = data_1.findDatumWithName('sex', data).coefficent;
      var refLifeTable = this.genderSpecificRefLifeTable[sex];

      if (refLifeTable) {
        return refLifeTable;
      } else {
        throw new errors_1.NoLifeTableFoundError(sex);
      }
    }
  }]);

  return LifeTableFunctions;
}();

LifeTableFunctions = tslib_1.__decorate([core_decorators_1.autobind], LifeTableFunctions);
exports.LifeTableFunctions = LifeTableFunctions;
//# sourceMappingURL=life-table-functions.js.map