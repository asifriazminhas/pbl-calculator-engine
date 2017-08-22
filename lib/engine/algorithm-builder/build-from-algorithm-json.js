"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_risk_1 = require("./get-risk");
const get_survival_to_time_1 = require("./get-survival-to-time");
const add_life_table_1 = require("./add-life-table");
const cox_1 = require("../json-parser/cox");
const to_json_1 = require("./to-json");
function buildFromAlgorithmJson(algorithmJson) {
    const cox = cox_1.parseCoxJsonToCox(algorithmJson);
    return {
        getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
        getRisk: get_risk_1.curryGetRiskFunction(cox),
        addLifeTable: add_life_table_1.curryAddLifeTable(cox, algorithmJson),
        toJson: to_json_1.curryToJsonFunction(algorithmJson)
    };
}
exports.buildFromAlgorithmJson = buildFromAlgorithmJson;
//# sourceMappingURL=build-from-algorithm-json.js.map