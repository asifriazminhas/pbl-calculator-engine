"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Calibration = void 0;

var _data = require("../../../../data");

var _undefined = require("../../../../../util/undefined");

var _errors = require("../../../../errors");

var _calibrationErrors = require("./calibration-errors");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Calibration = /*#__PURE__*/function () {
  function Calibration(calibration) {
    _classCallCheck(this, Calibration);

    this.calibration = calibration;
  }

  _createClass(Calibration, [{
    key: "getCalibrationFactorForData",
    value: function getCalibrationFactorForData(data) {
      var DefaultCalibrationFactor = 1;

      if (!this.calibration) {
        return DefaultCalibrationFactor;
      }

      try {
        var ageDatum = (0, _data.findDatumWithName)('age', data);
        return (0, _undefined.throwErrorIfUndefined)(this.calibration[ageDatum.coefficent], new _calibrationErrors.NoCalibrationFactorFoundError(ageDatum.coefficent));
      } catch (err) {
        if (err instanceof _errors.NoDatumFoundError) {
          return DefaultCalibrationFactor;
        } else if (err instanceof _calibrationErrors.NoCalibrationFactorFoundError) {
          console.warn(err.message);
          return DefaultCalibrationFactor;
        } else {
          throw err;
        }
      }
    }
  }]);

  return Calibration;
}();

exports.Calibration = Calibration;
//# sourceMappingURL=calibration.js.map