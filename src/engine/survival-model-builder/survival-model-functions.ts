import {
    ModelTypes,
    getAlgorithmForModelAndData,
    ModelType,
    updateBaselineForModel,
    JsonModelTypes,
} from '../model';
// @ts-ignore
import { Data, IDatum } from '../data';
import { getRiskToTime, getSurvivalToTime, Cox } from '../cox';
import * as moment from 'moment';
import {
    INewPredictorTypes,
    addPredictor,
    IBaselineObject,
} from '../regression-algorithm/regression-algorithm';

export type CalibrationObjects = Array<{ age: number; baseline: number }>;

export class SurvivalModelFunctions {
    private model: ModelTypes<Cox>;
    private modelJson: JsonModelTypes;

    constructor(model: ModelTypes<Cox>, modelJson: JsonModelTypes) {
        this.model = model;
        this.modelJson = modelJson;
    }

    public getAlgorithmForData(data: Data): Cox {
        return getAlgorithmForModelAndData(this.model, data) as Cox;
    }

    public getRiskToTime = (data: Data, time?: Date | moment.Moment) => {
        return getRiskToTime(this.getAlgorithmForData(data), data, time);
    };

    public getSurvivalToTime = (data: Data, time?: Date | moment.Moment) => {
        return getSurvivalToTime(this.getAlgorithmForData(data), data, time);
    };

    public addPredictor(
        newPredictor: INewPredictorTypes,
    ): SurvivalModelFunctions {
        if (this.model.modelType === ModelType.SingleAlgorithm) {
            return new SurvivalModelFunctions(
                Object.assign({}, this.model, {
                    algorithm: addPredictor(
                        this.model.algorithm as Cox,
                        newPredictor,
                    ),
                }),
                this.modelJson,
            );
        } else {
            return new SurvivalModelFunctions(
                Object.assign({}, this.model, {
                    algorithms: this.model.algorithms.map(algorithm => {
                        return Object.assign({}, algorithm, {
                            algorithms: addPredictor(
                                algorithm.algorithm as Cox,
                                newPredictor,
                            ),
                        });
                    }),
                }),
                this.modelJson,
            );
        }
    }

    public reCalibrateOutcome(
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
                ) as ModelTypes<Cox>,
                this.modelJson,
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
                ]) as ModelTypes<Cox>,
                this.modelJson,
            );
        }
    }

    public getModel(): ModelTypes {
        return this.model;
    }

    public getModelJson(): JsonModelTypes {
        return this.modelJson;
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
