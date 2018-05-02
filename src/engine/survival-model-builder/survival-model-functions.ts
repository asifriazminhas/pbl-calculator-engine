import {
    ModelTypes,
    getAlgorithmForModelAndData,
    ModelType,
    JsonModelTypes,
} from '../model';
// @ts-ignore
import { Data, IDatum } from '../data';
import * as moment from 'moment';
import { getPredicateResult } from '../multiple-algorithm-model/predicate/predicate';
import {
    CoxSurvivalAlgorithm,
    INewPredictor,
} from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import {
    ICalibrationFactorJsonObject,
    CalibrationJson,
} from '../../parsers/json/json-calibration';

export interface IGenderCalibrationObjects {
    male: ICalibrationFactorJsonObject[];
    female: ICalibrationFactorJsonObject[];
}

export class SurvivalModelFunctions {
    private model: ModelTypes;
    private modelJson: JsonModelTypes;

    constructor(model: ModelTypes, modelJson: JsonModelTypes) {
        this.model = model;
        this.modelJson = modelJson;
    }

    public getAlgorithmForData(data: Data): CoxSurvivalAlgorithm {
        return getAlgorithmForModelAndData(this.model, data);
    }

    public getRiskToTime = (data: Data, time?: Date | moment.Moment) => {
        return this.getAlgorithmForData(data).getRiskToTime(data, time);
    };

    public getSurvivalToTime = (data: Data, time?: Date | moment.Moment) => {
        return this.getAlgorithmForData(data).getSurvivalToTime(data, time);
    };

    public addPredictor(newPredictor: INewPredictor): SurvivalModelFunctions {
        if (this.model.modelType === ModelType.SingleAlgorithm) {
            return new SurvivalModelFunctions(
                Object.assign({}, this.model, {
                    algorithm: this.model.algorithm.addPredictor(newPredictor),
                }),
                this.modelJson,
            );
        } else {
            return new SurvivalModelFunctions(
                Object.assign({}, this.model, {
                    algorithms: this.model.algorithms.map(algorithm => {
                        return Object.assign({}, algorithm, {
                            algorithms: algorithm.algorithm.addPredictor(
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
                algorithm: this.model.algorithm.addCalibrationToAlgorithm(
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
                            algorithm: algorithm.addCalibrationToAlgorithm(
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
