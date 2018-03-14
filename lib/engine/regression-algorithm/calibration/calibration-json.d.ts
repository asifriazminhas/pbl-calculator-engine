import { IPredicateMixin } from '../../multiple-algorithm-model/predicate/predicate';
export interface ICalibrationFactorJsonObject {
    age: number;
    factor: number;
}
export interface ICalibrationJsonObject extends IPredicateMixin {
    calibrationFactorObjects: ICalibrationFactorJsonObject[];
}
export declare type CalibrationJson = ICalibrationJsonObject[];
