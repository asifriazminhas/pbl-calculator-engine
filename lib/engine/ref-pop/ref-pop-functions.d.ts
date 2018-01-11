import { ModelTypes } from '../model';
import { ReferencePopulation } from './reference-population';
import { Data } from '../data';
export declare class RefPopFunctions {
    private model;
    private refPop;
    constructor(model: ModelTypes, refPop: ReferencePopulation);
    getHealthAge(data: Data): number;
}
