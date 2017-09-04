"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_risk_1 = require("./get-risk");
const get_survival_to_time_1 = require("./get-survival-to-time");
const get_life_expectancy_1 = require("./get-life-expectancy");
const get_life_years_lost_1 = require("./get-life-years-lost");
const to_json_1 = require("./to-json");
const add_ref_pop_1 = require("./add-ref-pop");
const get_health_age_1 = require("./get-health-age");
const algorithm_evaluator_1 = require("../algorithm-evaluator");
const add_algorithm_1 = require("./add-algorithm");
function curryAddLifeTableFunctionWithAddRefPop(cox, coxJson) {
    return (lifeTable) => {
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, lifeTable),
            getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostFunction(coxJson.causeDeletedRef, lifeTable),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            withData: algorithm_evaluator_1.curryWithDataAndLifeTableFunctionsFunction({}),
            addRefPop: add_ref_pop_1.curryAddRefPopWithGetLifeExpectancy(cox, coxJson, lifeTable),
            addAlgorithm: add_algorithm_1.curryAddAlgorithmWithLifeTableFunctionsFunction(cox, lifeTable, coxJson)
        };
    };
}
exports.curryAddLifeTableFunctionWithAddRefPop = curryAddLifeTableFunctionWithAddRefPop;
function curryAddLifeTableFunctionWithGetHealthAge(cox, coxJson, refPop) {
    return (lifeTable) => {
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, lifeTable),
            getHealthAge: get_health_age_1.curryGetHeathAgeFunction(refPop),
            getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostFunction(coxJson.causeDeletedRef, lifeTable),
            withData: algorithm_evaluator_1.curryFullWithDataFunction({}),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            addAlgorithm: add_algorithm_1.curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(cox, coxJson, refPop, lifeTable)
        };
    };
}
exports.curryAddLifeTableFunctionWithGetHealthAge = curryAddLifeTableFunctionWithGetHealthAge;
//# sourceMappingURL=add-life-table.js.map