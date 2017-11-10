import { SurvivalModelFunctions } from '../survival-model-builder/survival-model-functions';
import { RefLifeTable } from './life-table';
import { LifeTableFunctions } from './life-table-functions';

export interface IWithRefLifeTable {
    withRefLifeTable: (refLifeTable: RefLifeTable) => LifeTableFunctions;
}

export interface ILifeTableFunctionsBuilder {
    withSurvivalModel: (
        survivalModel: SurvivalModelFunctions,
    ) => IWithRefLifeTable;
}

export const LifeTableFunctionsBuilder: ILifeTableFunctionsBuilder = {
    withSurvivalModel: (survivalModel: SurvivalModelFunctions) => {
        return {
            withRefLifeTable: (refLifeTable: RefLifeTable) => {
                return new LifeTableFunctions(survivalModel, refLifeTable);
            },
        };
    },
};
