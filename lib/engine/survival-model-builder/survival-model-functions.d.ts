import { Model } from '../model/model';
import { Data, IDatum } from '../data';
import * as moment from 'moment';
import { CoxSurvivalAlgorithm, INewPredictor } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { ICalibrationFactorJsonObject, CalibrationJson } from '../../parsers/json/json-calibration';
import { IModelJson } from '../../parsers/json/json-model';
export interface IGenderCalibrationObjects {
    male: ICalibrationFactorJsonObject[];
    female: ICalibrationFactorJsonObject[];
}
export declare class SurvivalModelFunctions {
    private model;
    private modelJson;
    constructor(model: Model, modelJson: IModelJson);
    getAlgorithmForData(data: Data): CoxSurvivalAlgorithm;
    getRiskToTime: (data: IDatum[], time?: moment.Moment | Date | undefined) => number;
    getSurvivalToTime: (data: IDatum[], time?: moment.Moment | Date | undefined) => number;
    addPredictor(newPredictor: INewPredictor): SurvivalModelFunctions;
    reCalibrateOutcome(calibrationJson: CalibrationJson | IGenderCalibrationObjects): SurvivalModelFunctions;
    getModel(): Model;
    getModelJson(): IModelJson;
}
