import { Model } from '../model/model';
import { ReferencePopulation, RefPopsWithPredicate } from './reference-population';
export declare class RefPopFunctions {
    private model;
    private refPop;
    constructor(model: Model, refPop: ReferencePopulation | RefPopsWithPredicate);
    getHealthAge: (data: import("../data/datum").IDatum[]) => number;
}
