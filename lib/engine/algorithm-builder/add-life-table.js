"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_risk_1 = require("./get-risk");
const get_survival_1 = require("./get-survival");
const replace_life_table_1 = require("./replace-life-table");
const get_life_expectancy_1 = require("./get-life-expectancy");
const to_json_1 = require("./to-json");
function addLifeTable(cox, lifeTable, coxJson) {
    return {
        getSurvival: get_survival_1.curryGetSurvivalFunction(cox),
        getRisk: get_risk_1.curryGetRiskFunction(cox),
        getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, lifeTable),
        replaceLifeTable: replace_life_table_1.curryReplaceLifeTable(cox, coxJson),
        toJson: to_json_1.curryToJsonFunction(coxJson)
    };
}
function curryAddLifeTable(cox, coxJson) {
    return (lifeTable) => {
        return addLifeTable(cox, lifeTable, coxJson);
    };
}
exports.curryAddLifeTable = curryAddLifeTable;
//# sourceMappingURL=add-life-table.js.map