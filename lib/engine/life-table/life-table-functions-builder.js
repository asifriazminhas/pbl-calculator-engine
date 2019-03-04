"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var life_table_functions_1 = require("./life-table-functions");

exports.LifeTableFunctionsBuilder = {
  withSurvivalModel: function withSurvivalModel(survivalModel) {
    return {
      withRefLifeTable: function withRefLifeTable(genderSpecificRefLifeTable) {
        return new life_table_functions_1.LifeTableFunctions(survivalModel, genderSpecificRefLifeTable);
      }
    };
  }
};
//# sourceMappingURL=life-table-functions-builder.js.map