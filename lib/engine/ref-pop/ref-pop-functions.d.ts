import { ModelTypes } from '../model';
import { ReferencePopulation, RefPopsWithPredicate } from './reference-population';
import { IDatum } from '../data';
export declare class RefPopFunctions {
    private model;
    private refPop;
    constructor(model: ModelTypes, refPop: ReferencePopulation | RefPopsWithPredicate);
    getHealthAge: (data: IDatum[]) => number;
}
