import { IGenderSpecificRefLifeTable } from './life-table';
import { LifeTableFunctions } from './life-table-functions';
import { Model } from '../model/model';
import { CoxSurvivalAlgorithm } from '../model';

export interface IWithRefLifeTable {
    withRefLifeTable: (
        genderSpecificRefLifeTable: IGenderSpecificRefLifeTable,
    ) => LifeTableFunctions;
}

export interface ILifeTableFunctionsBuilder {
    withSurvivalModel: (
        survivalModel: Model<CoxSurvivalAlgorithm>,
    ) => IWithRefLifeTable;
}

export const LifeTableFunctionsBuilder: ILifeTableFunctionsBuilder = {
    withSurvivalModel: (survivalModel: Model<CoxSurvivalAlgorithm>) => {
        return {
            withRefLifeTable: (
                genderSpecificRefLifeTable: IGenderSpecificRefLifeTable,
            ) => {
                return new LifeTableFunctions(
                    survivalModel,
                    genderSpecificRefLifeTable,
                );
            },
        };
    },
};
