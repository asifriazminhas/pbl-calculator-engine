"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_risk_1 = require("./get-risk");
const get_survival_to_time_1 = require("./get-survival-to-time");
const add_life_table_1 = require("./add-life-table");
const add_ref_pop_1 = require("./add-ref-pop");
const cox_1 = require("../json-parser/cox");
const to_json_1 = require("./to-json");
const algorithm_evaluator_1 = require("../algorithm-evaluator");
const add_algorithm_1 = require("./add-algorithm");
function curryBuildFromAlgorithmJsonFunction() {
    return (algorithmJson) => {
        const cox = cox_1.parseCoxJsonToCox(algorithmJson);
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            addLifeTable: add_life_table_1.curryAddLifeTableFunctionWithAddRefPop(cox, algorithmJson),
            addRefPop: add_ref_pop_1.curryAddRefPopWithAddLifeTable(cox, algorithmJson),
            withData: algorithm_evaluator_1.curryBaseWithDataFunction({}),
            toJson: to_json_1.curryToJsonFunction(algorithmJson),
            addAlgorithm: add_algorithm_1.curryBaseAddAlgorithmFunction(cox, algorithmJson)
        };
    };
}
exports.curryBuildFromAlgorithmJsonFunction = curryBuildFromAlgorithmJsonFunction;
//# sourceMappingURL=build-from-algorithm-json.js.map