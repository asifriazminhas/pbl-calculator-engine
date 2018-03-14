"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
class NoCalibrationFactorFoundError extends Error {
    constructor(age) {
        super(`No calibration factor found for age ${age}`);
    }
}
exports.NoCalibrationFactorFoundError = NoCalibrationFactorFoundError;
class NoCalibrationFoundError extends Error {
    constructor(data) {
        super(`No calibration found for data ${JSON.stringify(data, null, 2)}`);
    }
}
exports.NoCalibrationFoundError = NoCalibrationFoundError;
//# sourceMappingURL=calibration-errors.js.map