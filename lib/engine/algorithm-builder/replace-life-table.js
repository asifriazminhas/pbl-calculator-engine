"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_survival_to_time_1 = require("./get-survival-to-time");
const get_risk_1 = require("./get-risk");
const get_life_expectancy_1 = require("./get-life-expectancy");
const to_json_1 = require("./to-json");
function curryReplaceLifeTable(cox, coxJson) {
    return (lifeTable) => {
        return replaceLifeTable(cox, lifeTable, coxJson);
    };
}
exports.curryReplaceLifeTable = curryReplaceLifeTable;
function replaceLifeTable(cox, lifeTable, coxJson) {
    return {
        getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
        getRisk: get_risk_1.curryGetRiskFunction(cox),
        getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, lifeTable),
        replaceLifeTable: curryReplaceLifeTable(cox, coxJson),
        toJson: to_json_1.curryToJsonFunction(coxJson)
    };
}
//# sourceMappingURL=replace-life-table.js.map