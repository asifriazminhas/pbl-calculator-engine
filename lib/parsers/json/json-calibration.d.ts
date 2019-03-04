import { PredicateJson } from './json-predicate';
export interface ICalibrationFactorJsonObject {
    age: number;
    factor: number;
}
export interface ICalibrationJsonObject {
    calibrationFactorObjects: ICalibrationFactorJsonObject[];
    predicate: PredicateJson;
}
export declare type CalibrationJson = ICalibrationJsonObject[];
