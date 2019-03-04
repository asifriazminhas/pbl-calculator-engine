"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../../../data");
const undefined_1 = require("../../../../../util/undefined");
const errors_1 = require("../../../../errors");
const calibration_errors_1 = require("./calibration-errors");
class Calibration {
    constructor(calibration) {
        this.calibration = calibration;
    }
    getCalibrationFactorForData(data) {
        const DefaultCalibrationFactor = 1;
        if (!this.calibration) {
            return DefaultCalibrationFactor;
        }
        try {
            const ageDatum = data_1.findDatumWithName('age', data);
            return undefined_1.throwErrorIfUndefined(this.calibration[ageDatum.coefficent], new calibration_errors_1.NoCalibrationFactorFoundError(ageDatum.coefficent));
        }
        catch (err) {
            if (err instanceof errors_1.NoDatumFoundError) {
                return DefaultCalibrationFactor;
            }
            else if (err instanceof calibration_errors_1.NoCalibrationFactorFoundError) {
                console.warn(err.message);
                return DefaultCalibrationFactor;
            }
            else {
                throw err;
            }
        }
    }
}
exports.Calibration = Calibration;
//# sourceMappingURL=calibration.js.map