import {
    ModelTypes,
    getAlgorithmForModelAndData,
    ModelType,
    JsonModelTypes,
} from '../model';
// @ts-ignore
import { Data, IDatum } from '../data';
import { getRiskToTime, getSurvivalToTime, Cox } from '../cox';
import * as moment from 'moment';
import {
    INewPredictorTypes,
    addPredictor,
} from '../regression-algorithm/regression-algorithm';
import {
    CalibrationJson,
    ICalibrationFactorJsonObject,
} from '../regression-algorithm/calibration/calibration-json';
import { addCalibrationToAlgorithm } from '../regression-algorithm/calibration/calibration';
import { getPredicateResult } from '../multiple-algorithm-model/predicate/predicate';

export interface IGenderCalibrationObjects {
    male: ICalibrationFactorJsonObject[];
    female: ICalibrationFactorJsonObject[];
}

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
        calibrationJson: CalibrationJson | IGenderCalibrationObjects,
    ): SurvivalModelFunctions {
        let calibrationJsonToUse: CalibrationJson;
        // If the calibrationJson is of type IGenderCalibrationObjects
        if ('male' in calibrationJson) {
            calibrationJsonToUse = [
                {
                    calibrationFactorObjects: calibrationJson.male,
                    predicate: {
                        equation: `predicateResult = obj["sex"] === "male"`,
                        variables: ['sex'],
                    },
                },
                {
                    calibrationFactorObjects: calibrationJson.female,
                    predicate: {
                        equation: `predicateResult = obj["sex"] === "male"`,
                        variables: ['sex'],
                    },
                },
            ];
        } else {
            calibrationJsonToUse = calibrationJson;
        }

        if (this.model.modelType === ModelType.SingleAlgorithm) {
            const calibratedModel = Object.assign({}, this.model, {
                algorithm: addCalibrationToAlgorithm(
                    this.model.algorithm,
                    calibrationJsonToUse,
                    [],
                ),
            });
            return new SurvivalModelFunctions(calibratedModel, this.modelJson);
        } else {
            const predicateData = [
                [{ name: 'sex', coefficent: 'male' }],
                [{ name: 'sex', coefficent: 'female' }],
            ];

            const calibratedModel = Object.assign({}, this.model, {
                algorithms: this.model.algorithms.map(
                    ({ algorithm, predicate }) => {
                        const predicateDataForCurrentPredicate = predicateData.find(
                            currentPredicateData => {
                                return getPredicateResult(
                                    currentPredicateData,
                                    predicate,
                                );
                            },
                        ) as Data;

                        return {
                            algorithm: addCalibrationToAlgorithm(
                                algorithm,
                                calibrationJsonToUse,
                                predicateDataForCurrentPredicate,
                            ),
                            predicate,
                        };
                    },
                ),
            });

            return new SurvivalModelFunctions(calibratedModel, this.modelJson);
        }
    }

    public getModel(): ModelTypes {
        return this.model;
    }

    public getModelJson(): JsonModelTypes {
        return this.modelJson;
    }
}
