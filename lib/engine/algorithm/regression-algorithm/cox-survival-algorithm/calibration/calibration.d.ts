import { Data } from '../../../../data';
export declare class Calibration {
    calibration?: {
        [index: number]: number | undefined;
    };
    constructor(calibration?: {
        [index: number]: number | undefined;
    });
    getCalibrationFactorForData(data: Data): number;
}
