import { ModelTypes, JsonModelTypes } from '../model';
import { Data, IDatum } from '../data';
import { Cox } from '../cox';
import * as moment from 'moment';
import { INewPredictorTypes } from '../regression-algorithm/regression-algorithm';
import { CalibrationJson } from '../regression-algorithm/calibration/calibration-json';
export declare type CalibrationObjects = Array<{
    age: number;
    baseline: number;
}>;
export declare class SurvivalModelFunctions {
    private model;
    private modelJson;
    constructor(model: ModelTypes<Cox>, modelJson: JsonModelTypes);
    getAlgorithmForData(data: Data): Cox;
    getRiskToTime: (data: IDatum[], time?: moment.Moment | Date | undefined) => number;
    getSurvivalToTime: (data: IDatum[], time?: moment.Moment | Date | undefined) => number;
    addPredictor(newPredictor: INewPredictorTypes): SurvivalModelFunctions;
    reCalibrateOutcome(calibrationJson: CalibrationJson): SurvivalModelFunctions;
    getModel(): ModelTypes;
    getModelJson(): JsonModelTypes;
}