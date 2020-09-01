"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bins = void 0;

var _undefined = require("../../../../../util/undefined/undefined");

var _noBinFoundError = require("../../../../errors/no-bin-found-error");

var _jsonBins = require("../../../../../parsers/json/json-bins");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bins = /*#__PURE__*/function () {
  function Bins(binsJson) {
    _classCallCheck(this, Bins);

    this.binsData = binsJson.binsData;
    this.binsLookup = (0, _jsonBins.parseBinsLookupFromBinsJson)(binsJson);
  }

  _createClass(Bins, [{
    key: "getBinDataForScore",
    value: function getBinDataForScore(score) {
      var _this = this;

      // Get the bin number for the above cox risk and throw an error if nothing was found
      var binNumber = (0, _undefined.throwErrorIfUndefined)(this.binsLookup.find(function (binsLookupRow, index) {
        if (index !== _this.binsLookup.length - 1) {
          return score >= binsLookupRow.minScore && score < binsLookupRow.maxScore;
        } else {
          return score >= binsLookupRow.minScore && score <= binsLookupRow.maxScore;
        }
      }), new _noBinFoundError.NoBinFoundError(score)).binNumber;
      return this.binsData[binNumber];
    }
    /**
     * Returns the time field for the binDatum with the same survival percent
     * as the survival percent arg
     *
     * @param {number} survivalPercent
     * @param {IBinData[]} binData
     * @returns {number}
     * @memberof Bins
     */

  }, {
    key: "getTimeForSurvival",
    value: function getTimeForSurvival(survivalPercent, binData) {
      return (0, _undefined.throwErrorIfUndefined)(binData.find(function (binDatum) {
        return binDatum.survivalPercent === survivalPercent;
      }), new Error("No bin datum found for survival percent ".concat(survivalPercent))).time;
    }
  }]);

  return Bins;
}();

exports.Bins = Bins;
//# sourceMappingURL=bins.js.map