import { IGenderSpecificRefLifeTable } from './life-table';
import { Data, IDatum } from '../data';
import { SurvivalModelFunctions } from '../survival-model-builder/survival-model-functions';
export declare class LifeTableFunctions {
    private survivalFunctions;
    private genderSpecificRefLifeTable;
    constructor(survivalFunctions: SurvivalModelFunctions, genderSpecificRefLifeTable: IGenderSpecificRefLifeTable);
    getLifeExpectancy: (data: IDatum[]) => number;
    getSurvivalToAge(data: Data, toAge: number): number;
    private getRefLifeTableForData(data);
}
