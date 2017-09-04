"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_survival_to_time_1 = require("./get-survival-to-time");
const get_risk_1 = require("./get-risk");
const add_life_table_1 = require("./add-life-table");
const get_life_years_lost_1 = require("./get-life-years-lost");
const get_life_expectancy_1 = require("./get-life-expectancy");
const to_json_1 = require("./to-json");
const get_health_age_1 = require("./get-health-age");
const algorithm_evaluator_1 = require("../algorithm-evaluator");
const add_algorithm_1 = require("./add-algorithm");
function curryAddRefPopWithAddLifeTable(cox, coxJson) {
    return (refPop) => {
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            getHealthAge: get_health_age_1.curryGetHeathAgeFunction(refPop),
            withData: algorithm_evaluator_1.curryWithDataAndGetHealthAgeFunction({}),
            addLifeTable: add_life_table_1.curryAddLifeTableFunctionWithGetHealthAge(cox, coxJson, refPop),
            addAlgorithm: add_algorithm_1.curryAddAlgorithmReturnsGetHealthAgeFunction(cox, coxJson, refPop)
        };
    };
}
exports.curryAddRefPopWithAddLifeTable = curryAddRefPopWithAddLifeTable;
function curryAddRefPopWithGetLifeExpectancy(cox, coxJson, refLifeTable) {
    return (refPop) => {
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            getHealthAge: get_health_age_1.curryGetHeathAgeFunction(refPop),
            getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, refLifeTable),
            withData: algorithm_evaluator_1.curryFullWithDataFunction({}),
            getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostFunction(coxJson.causeDeletedRef, refLifeTable),
            addAlgorithm: add_algorithm_1.curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(cox, coxJson, refPop, refLifeTable)
        };
    };
}
exports.curryAddRefPopWithGetLifeExpectancy = curryAddRefPopWithGetLifeExpectancy;
//# sourceMappingURL=add-ref-pop.js.map