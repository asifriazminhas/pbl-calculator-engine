// tslint:disable:max-classes-per-file

import { Data } from '../../data';

export class NoCalibrationFactorFoundError extends Error {
    constructor(age: number) {
        super(`No calibration factor found for age ${age}`);
    }
}

export class NoCalibrationFoundError extends Error {
    constructor(data: Data) {
        super(`No calibration found for data ${JSON.stringify(data, null, 2)}`);
    }
}
