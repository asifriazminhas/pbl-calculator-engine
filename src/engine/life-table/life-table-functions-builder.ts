import { SurvivalModelFunctions } from '../survival-model-builder/survival-model-functions';
import { IGenderSpecificRefLifeTable } from './life-table';
import { LifeTableFunctions } from './life-table-functions';

export interface IWithRefLifeTable {
    withRefLifeTable: (
        genderSpecificRefLifeTable: IGenderSpecificRefLifeTable,
    ) => LifeTableFunctions;
}

export interface ILifeTableFunctionsBuilder {
    withSurvivalModel: (
        survivalModel: SurvivalModelFunctions,
    ) => IWithRefLifeTable;
}

export const LifeTableFunctionsBuilder: ILifeTableFunctionsBuilder = {
    withSurvivalModel: (survivalModel: SurvivalModelFunctions) => {
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
