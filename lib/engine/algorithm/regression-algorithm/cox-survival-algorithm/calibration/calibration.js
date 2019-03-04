"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var data_1 = require("../../../../data");

var undefined_1 = require("../../../../../util/undefined");

var errors_1 = require("../../../../errors");

var calibration_errors_1 = require("./calibration-errors");

var Calibration =
/*#__PURE__*/
function () {
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
        var ageDatum = data_1.findDatumWithName('age', data);
        return undefined_1.throwErrorIfUndefined(this.calibration[ageDatum.coefficent], new calibration_errors_1.NoCalibrationFactorFoundError(ageDatum.coefficent));
      } catch (err) {
        if (err instanceof errors_1.NoDatumFoundError) {
          return DefaultCalibrationFactor;
        } else if (err instanceof calibration_errors_1.NoCalibrationFactorFoundError) {
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