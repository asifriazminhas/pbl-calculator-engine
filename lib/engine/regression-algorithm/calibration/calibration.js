"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../data");
const errors_1 = require("../../errors");
const undefined_1 = require("../../undefined");
const calibration_errors_1 = require("./calibration-errors");
const predicate_errors_1 = require("../../multiple-algorithm-model/predicate/predicate-errors");
const predicate_1 = require("../../multiple-algorithm-model/predicate/predicate");
function reduceCalibrationFactorObjectsToCalibration(calibrationFactorObjects) {
    return calibrationFactorObjects.reduce((calibrationFactors, currentCalibrationFactorObject) => {
        calibrationFactors[currentCalibrationFactorObject.age] =
            currentCalibrationFactorObject.factor;
        return calibrationFactors;
    }, {});
}
function addCalibrationToAlgorithm(algorithm, calibrationJson, predicateData) {
    try {
        const calibrationFactorObjects = predicate_1.getFirstTruePredicateObject(calibrationJson, predicateData).calibrationFactorObjects;
        const calibration = reduceCalibrationFactorObjectsToCalibration(calibrationFactorObjects);
        return Object.assign({}, algorithm, {
            calibration,
        });
    }
    catch (err) {
        if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
            console.warn(new calibration_errors_1.NoCalibrationFoundError(predicateData).message);
            return algorithm;
        }
        else {
            throw Error;
        }
    }
}
exports.addCalibrationToAlgorithm = addCalibrationToAlgorithm;
function getCalibrationFactorForData({ calibration }, data) {
    const DefaultCalibrationFactor = 1;
    if (!calibration) {
        return DefaultCalibrationFactor;
    }
    try {
        const ageDatum = data_1.findDatumWithName('age', data);
        return undefined_1.throwErrorIfUndefined(calibration[ageDatum.coefficent], new calibration_errors_1.NoCalibrationFactorFoundError(ageDatum.coefficent));
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
exports.getCalibrationFactorForData = getCalibrationFactorForData;
//# sourceMappingURL=calibration.js.map