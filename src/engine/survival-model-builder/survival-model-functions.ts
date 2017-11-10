import { ModelTypes, getAlgorithmForModelAndData } from '../model';
import { Data } from '../data';
import { getRiskToTime, getSurvivalToTime, Cox } from '../cox';
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

    public getModel(): ModelTypes {
        return this.model;
    }
}
