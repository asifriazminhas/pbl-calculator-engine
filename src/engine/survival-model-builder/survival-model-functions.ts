import {
    ModelTypes,
    getAlgorithmForModelAndData,
    ModelType,
    updateBaselineHazardForModel,
} from '../model';
import { Data } from '../data';
import { getRiskToTime, getSurvivalToTime, Cox } from '../cox';
import {
    INewPredictorTypes,
    addPredictor,
    IBaselineHazardObject,
} from '../algorithm';
import * as moment from 'moment';

export type CalibrationObjects = Array<{ age: number; baselineHazard: number }>;

export class SurvivalModelFunctions {
    private model: ModelTypes;

    constructor(model: ModelTypes) {
        this.model = model;
    }

    public getAlgorithmForData(data: Data): Cox {
        return getAlgorithmForModelAndData(this.model, data);
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
    ): ModelTypes {
        if (calibrationObjects instanceof Array) {
            this.model = updateBaselineHazardForModel(
                this.model,
                this.convertCalibrationObjectsToBaselineHazardObject(
                    calibrationObjects,
                ),
            );
        } else {
            this.model = updateBaselineHazardForModel(this.model, [
                {
                    predicateData: [
                        {
                            name: 'sex',
                            coefficent: 'male',
                        },
                    ],
                    newBaselineHazard: this.convertCalibrationObjectsToBaselineHazardObject(
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
                    newBaselineHazard: this.convertCalibrationObjectsToBaselineHazardObject(
                        calibrationObjects.female,
                    ),
                },
            ]);
        }

        return this.model;
    }

    public getModel(): ModelTypes {
        return this.model;
    }

    private convertCalibrationObjectsToBaselineHazardObject(
        calibrationObjects: CalibrationObjects,
    ): IBaselineHazardObject {
        return calibrationObjects.reduce(
            (baselineHazardObject, currentCalibrationObject) => {
                return Object.assign({}, baselineHazardObject, {
                    [currentCalibrationObject.age]:
                        currentCalibrationObject.baselineHazard,
                });
            },
            {} as IBaselineHazardObject,
        );
    }
}
