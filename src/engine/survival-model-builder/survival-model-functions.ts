import {
    ModelTypes,
    getAlgorithmForModelAndData,
    ModelType,
    updateBaselineForModel,
} from '../model';
import { Data } from '../data';
import { getRiskToTime, getSurvivalToTime, Cox } from '../cox';
import {
    INewPredictorTypes,
    addPredictor,
    IBaselineObject,
} from '../algorithm';
import * as moment from 'moment';

export type CalibrationObjects = Array<{ age: number; baseline: number }>;

export class SurvivalModelFunctions {
    private model: ModelTypes;

    constructor(model: ModelTypes) {
        this.model = model;
    }

    public getAlgorithmForData(data: Data): Cox {
        return getAlgorithmForModelAndData(this.model, data) as Cox;
    }

    public getRiskToTime(data: Data, time?: Date | moment.Moment) {
        return getRiskToTime(this.getAlgorithmForData(data), data, time);
    }

    public getSurvivalToTime(data: Data, time?: Date | moment.Moment) {
        return getSurvivalToTime(this.getAlgorithmForData(data), data, time);
    }

    public addPredictor(
        newPredictor: INewPredictorTypes,
    ): SurvivalModelFunctions {
        if (this.model.modelType === ModelType.SingleAlgorithm) {
            return new SurvivalModelFunctions(
                Object.assign({}, this.model, {
                    algorithm: addPredictor(this.model.algorithm, newPredictor),
                }),
            );
        } else {
            return new SurvivalModelFunctions(
                Object.assign({}, this.model, {
                    algorithms: this.model.algorithms.map(algorithm => {
                        return Object.assign({}, algorithm, {
                            algorithms: addPredictor(
                                algorithm.algorithm,
                                newPredictor,
                            ),
                        });
                    }),
                }),
            );
        }
    }

    public addCalibration(
        calibrationObjects:
            | CalibrationObjects
            | {
                  male: CalibrationObjects;
                  female: CalibrationObjects;
              },
    ): SurvivalModelFunctions {
        if (calibrationObjects instanceof Array) {
            return new SurvivalModelFunctions(
                updateBaselineForModel(
                    this.model,
                    this.convertCalibrationObjectsToBaselineObject(
                        calibrationObjects,
                    ),
                ),
            );
        } else {
            return new SurvivalModelFunctions(
                updateBaselineForModel(this.model, [
                    {
                        predicateData: [
                            {
                                name: 'sex',
                                coefficent: 'male',
                            },
                        ],
                        newBaseline: this.convertCalibrationObjectsToBaselineObject(
                            calibrationObjects.male,
                        ),
                    },
                    {
                        predicateData: [
                            {
                                name: 'sex',
                                coefficent: 'female',
                            },
                        ],
                        newBaseline: this.convertCalibrationObjectsToBaselineObject(
                            calibrationObjects.female,
                        ),
                    },
                ]),
            );
        }
    }

    public getModel(): ModelTypes {
        return this.model;
    }

    private convertCalibrationObjectsToBaselineObject(
        calibrationObjects: CalibrationObjects,
    ): IBaselineObject {
        return calibrationObjects.reduce(
            (baselineObject, currentCalibrationObject) => {
                return Object.assign({}, baselineObject, {
                    [currentCalibrationObject.age]:
                        currentCalibrationObject.baseline,
                });
            },
            {} as IBaselineObject,
        );
    }
}
