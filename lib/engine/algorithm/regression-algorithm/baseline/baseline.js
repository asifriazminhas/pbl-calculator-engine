"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Baseline = void 0;

var _sortedIndexBy2 = _interopRequireDefault(require("lodash/sortedIndexBy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Baseline = /*#__PURE__*/function () {
  function Baseline(baselineJson) {
    _classCallCheck(this, Baseline);

    if (baselineJson === null || baselineJson === undefined) {
      this.baseline = 1;
    } else if (typeof baselineJson === 'number') {
      this.baseline = baselineJson;
    } else {
      this.baseline = baselineJson;
    }
  }

  _createClass(Baseline, [{
    key: "getBaselineHazard",
    value: function getBaselineHazard(timeInDays) {
      /* If it's a number then it's not a function of the age datum in the data argument so return it */
      if (typeof this.baseline === 'number') {
        return this.baseline;
      } else {
        var closestTimeIndex = (0, _sortedIndexBy2.default)(this.baseline, {
          time: timeInDays,
          baselineHazard: 1
        }, function (baselineObj) {
          return baselineObj.time;
        });
        return this.baseline[closestTimeIndex === this.baseline.length ? closestTimeIndex - 1 : closestTimeIndex].baselineHazard;
      }
    }
  }]);

  return Baseline;
}();

exports.Baseline = Baseline;
//# sourceMappingURL=baseline.js.map