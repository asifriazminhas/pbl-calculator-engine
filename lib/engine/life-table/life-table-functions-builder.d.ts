import { IGenderSpecificRefLifeTable } from './life-table';
import { LifeTableFunctions } from './life-table-functions';
import { Model } from '../model/model';
export interface IWithRefLifeTable {
    withRefLifeTable: (genderSpecificRefLifeTable: IGenderSpecificRefLifeTable) => LifeTableFunctions;
}
export interface ILifeTableFunctionsBuilder {
    withSurvivalModel: (survivalModel: Model) => IWithRefLifeTable;
}
export declare const LifeTableFunctionsBuilder: ILifeTableFunctionsBuilder;
