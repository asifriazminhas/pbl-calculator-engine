import { ModelTypes, getAlgorithmForModelAndData, ModelType } from '../model';
import { Data } from '../data';
import {
    getRiskToTime,
    getSurvivalToTime,
    Cox,
    INewPredictorTypes,
    addPredictor,
} from '../cox';
import * as moment from 'moment';

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

    public getModel(): ModelTypes {
        return this.model;
    }
}
