import { Model } from '../model/model';
import { ReferencePopulation, RefPopsWithPredicate } from './reference-population';
import { CoxSurvivalAlgorithm } from '../model';
export declare class RefPopFunctions {
    private model;
    private refPop;
    constructor(model: Model<CoxSurvivalAlgorithm>, refPop: ReferencePopulation | RefPopsWithPredicate);
    getHealthAge: (data: import("../data").IDatum[]) => number;
}
