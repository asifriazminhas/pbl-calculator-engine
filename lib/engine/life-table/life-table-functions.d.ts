import { IGenderSpecificRefLifeTable } from './life-table';
import { Data } from '../data';
import { Model } from '../model/model';
import { CoxSurvivalAlgorithm } from '../model';
export declare class LifeTableFunctions {
    model: Model<CoxSurvivalAlgorithm>;
    private genderSpecificRefLifeTable;
    private useExFromAge;
    constructor(model: Model<CoxSurvivalAlgorithm>, genderSpecificRefLifeTable: IGenderSpecificRefLifeTable, useExFromAge?: number);
    getLifeExpectancy(data: Data): number;
    getSurvivalToAge(data: Data, toAge: number): number;
    private getCompleteLifeTable;
    private getRefLifeTable;
}
