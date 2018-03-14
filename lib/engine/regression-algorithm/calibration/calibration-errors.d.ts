import { Data } from '../../data';
export declare class NoCalibrationFactorFoundError extends Error {
    constructor(age: number);
}
export declare class NoCalibrationFoundError extends Error {
    constructor(data: Data);
}
