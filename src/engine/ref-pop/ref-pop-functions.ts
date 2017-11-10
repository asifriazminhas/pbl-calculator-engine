import { ModelTypes, getAlgorithmForModelAndData } from '../model';
import { ReferencePopulation } from './reference-population';
import { getHealthAge } from './health-age';
import { Data } from '../data';

export class RefPopFunctions {
    private model: ModelTypes;
    private refPop: ReferencePopulation;

    constructor(model: ModelTypes, refPop: ReferencePopulation) {
        this.model = model;
        this.refPop = refPop;
    }

    public getHealthAge(data: Data): number {
        return getHealthAge(
            this.refPop,
            data,
            getAlgorithmForModelAndData(this.model, data),
        );
    }
}
