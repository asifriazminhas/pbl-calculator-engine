"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifeTableFunctions = void 0;

var _autobind2 = _interopRequireDefault(require("core-decorators/lib/autobind"));

var _tslib = require("tslib");

var _lifeTable = require("./life-table");

var _lifeExpectancy = require("./life-expectancy");

var _survivalToAge = require("./survival-to-age");

var _data = require("../data");

var _errors = require("../errors");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LifeTableFunctions = /*#__PURE__*/function () {
  function LifeTableFunctions(model, genderSpecificRefLifeTable) {
    var _this = this;

    var useExFromAge = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 99;

    _classCallCheck(this, LifeTableFunctions);

    this.getCompleteLifeTable = (0, _memoizeOne.default)(function (data) {
      return (0, _lifeTable.getCompleteLifeTableForDataUsingAlgorithm)(_this.getRefLifeTable(data), data, _this.model.getAlgorithmForData(data), _this.useExFromAge);
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
        return (0, _lifeExpectancy.getLifeExpectancyForAge)(Number((0, _data.findDatumWithName)('age', data).coefficent), this.getCompleteLifeTable(data));
      }
    }
  }, {
    key: "getSurvivalToAge",
    value: function getSurvivalToAge(data, toAge) {
      return (0, _survivalToAge.getSurvivalToAge)(this.getCompleteLifeTable(data), toAge);
    }
  }, {
    key: "getRefLifeTable",
    value: function getRefLifeTable(data) {
      var sex = (0, _data.findDatumWithName)('sex', data).coefficent;
      var refLifeTable = this.genderSpecificRefLifeTable[sex];

      if (refLifeTable) {
        return refLifeTable;
      } else {
        throw new _errors.NoLifeTableFoundError(sex);
      }
    }
  }]);

  return LifeTableFunctions;
}();

exports.LifeTableFunctions = LifeTableFunctions;
exports.LifeTableFunctions = LifeTableFunctions = (0, _tslib.__decorate)([_autobind2.default], LifeTableFunctions);
//# sourceMappingURL=life-table-functions.js.map