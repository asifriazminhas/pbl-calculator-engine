import { CalibrationJson } from './calibration-json';
import { Data } from '../../data';
export interface ICalibration {
    [index: number]: number | undefined;
}
export interface ICalibratedMixin {
    calibration?: ICalibration;
}
export declare function addCalibrationToAlgorithm<T extends ICalibratedMixin>(algorithm: T, calibrationJson: CalibrationJson, predicateData: Data): T;
export declare function getCalibrationFactorForData({calibration}: ICalibratedMixin, data: Data): number;
