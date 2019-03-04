"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var data_1 = require("../../../data");

var undefined_1 = require("../../../../util/undefined");

var errors_1 = require("../../../errors");

var Baseline =
/*#__PURE__*/
function () {
  function Baseline(baselineJson) {
    _classCallCheck(this, Baseline);

    if (baselineJson === null || baselineJson === undefined) {
      this.baseline = 1;
    } else if (typeof baselineJson === 'number') {
      this.baseline = baselineJson;
    } else {
      this.baseline = baselineJson.reduce(function (baseline, currentBaselineJsonItem) {
        baseline[currentBaselineJsonItem.age] = currentBaselineJsonItem.baseline;
        return baseline;
      }, {});
    }
  }

  _createClass(Baseline, [{
    key: "getBaselineForData",
    value: function getBaselineForData(data) {
      /* If it's a number then it's not a function of the age datum in the data argument so return it */
      if (typeof this.baseline === 'number') {
        return this.baseline;
      } else {
        // Get the age datum
        var ageDatum = data_1.findDatumWithName('age', data); // Get the baseline value for this age value. If it doesn't exist then
        // throw an error

        return undefined_1.throwErrorIfUndefined(this.baseline[Number(ageDatum.coefficent)], new errors_1.NoBaselineFoundForAge(ageDatum.coefficent));
      }
    }
  }]);

  return Baseline;
}();

exports.Baseline = Baseline;
//# sourceMappingURL=baseline.js.map