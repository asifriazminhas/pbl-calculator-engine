import { Model } from '../model/model';
import { Data, IDatum } from '../data';
import moment from 'moment';
import { CoxSurvivalAlgorithm, INewPredictor } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { ICalibrationFactorJsonObject, CalibrationJson } from '../../parsers/json/json-calibration';
import { IModelJson } from '../../parsers/json/json-model';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
export interface IGenderCalibrationObjects {
    male: ICalibrationFactorJsonObject[];
    female: ICalibrationFactorJsonObject[];
}
export declare class SurvivalModelFunctions {
    private model;
    private modelJson;
    constructor(model: Model<CoxSurvivalAlgorithm>, modelJson: IModelJson<ICoxSurvivalAlgorithmJson>);
    getAlgorithmForData(data: Data): CoxSurvivalAlgorithm;
    getRiskToTime: (data: IDatum[], time?: Date | moment.Moment | undefined) => number;
    getSurvivalToTime: (data: IDatum[], time?: Date | moment.Moment | undefined) => number;
    addPredictor(newPredictor: INewPredictor): SurvivalModelFunctions;
    reCalibrateOutcome(calibrationJson: CalibrationJson | IGenderCalibrationObjects): SurvivalModelFunctions;
    getModel(): Model<CoxSurvivalAlgorithm>;
    getModelJson(): IModelJson<ICoxSurvivalAlgorithmJson>;
}
