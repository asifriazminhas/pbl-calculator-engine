"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_table_functions_1 = require("./life-table-functions");
exports.LifeTableFunctionsBuilder = {
    withSurvivalModel: (survivalModel) => {
        return {
            withRefLifeTable: (genderSpecificRefLifeTable) => {
                return new life_table_functions_1.LifeTableFunctions(survivalModel, genderSpecificRefLifeTable);
            },
        };
    },
};
//# sourceMappingURL=life-table-functions-builder.js.map