import { ModelTypes, JsonModelTypes } from '../model';
import { Data, IDatum } from '../data';
import { Cox } from '../cox';
import { INewPredictorTypes } from '../algorithm';
import * as moment from 'moment';
export declare type CalibrationObjects = Array<{
    age: number;
    baseline: number;
}>;
export declare class SurvivalModelFunctions {
    private model;
    private modelJson;
    constructor(model: ModelTypes, modelJson: JsonModelTypes);
    getAlgorithmForData(data: Data): Cox;
    getRiskToTime: (data: IDatum[], time?: moment.Moment | Date | undefined) => number;
    getSurvivalToTime: (data: IDatum[], time?: moment.Moment | Date | undefined) => number;
    addPredictor(newPredictor: INewPredictorTypes): SurvivalModelFunctions;
    reCalibrateOutcome(calibrationObjects: CalibrationObjects | {
        male: CalibrationObjects;
        female: CalibrationObjects;
    }): SurvivalModelFunctions;
    getModel(): ModelTypes;
    getModelJson(): JsonModelTypes;
    private convertCalibrationObjectsToBaselineObject(calibrationObjects);
}
