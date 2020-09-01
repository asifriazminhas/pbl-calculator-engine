"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifeTableFunctionsBuilder = void 0;

var _lifeTableFunctions = require("./life-table-functions");

var LifeTableFunctionsBuilder = {
  withSurvivalModel: function withSurvivalModel(survivalModel) {
    return {
      withRefLifeTable: function withRefLifeTable(genderSpecificRefLifeTable) {
        return new _lifeTableFunctions.LifeTableFunctions(survivalModel, genderSpecificRefLifeTable);
      }
    };
  }
};
exports.LifeTableFunctionsBuilder = LifeTableFunctionsBuilder;
//# sourceMappingURL=life-table-functions-builder.js.map