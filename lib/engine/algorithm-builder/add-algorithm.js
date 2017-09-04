"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_survival_to_time_1 = require("./get-survival-to-time");
const get_risk_1 = require("./get-risk");
const add_life_table_1 = require("./add-life-table");
const get_life_expectancy_1 = require("./get-life-expectancy");
const get_life_years_lost_1 = require("./get-life-years-lost");
const add_ref_pop_1 = require("./add-ref-pop");
const to_json_1 = require("./to-json");
const algorithm_evaluator_1 = require("../algorithm-evaluator");
const get_health_age_1 = require("./get-health-age");
function curryBaseAddAlgorithmFunction(cox, coxJson) {
    return (addedCox) => {
        addedCox;
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            addLifeTable: add_life_table_1.curryAddLifeTableFunctionWithAddRefPop(cox, coxJson),
            addRefPop: add_ref_pop_1.curryAddRefPopWithAddLifeTable(cox, coxJson),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            withData: algorithm_evaluator_1.curryBaseWithDataFunction({})
        };
    };
}
exports.curryBaseAddAlgorithmFunction = curryBaseAddAlgorithmFunction;
function curryAddAlgorithmWithLifeTableFunctionsFunction(cox, refLifeTable, coxJson) {
    return (addedCox) => {
        addedCox;
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, refLifeTable),
            getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostFunction(coxJson.causeDeletedRef, refLifeTable),
            addRefPop: add_ref_pop_1.curryAddRefPopWithGetLifeExpectancy(cox, coxJson, refLifeTable),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            withData: algorithm_evaluator_1.curryWithDataAndLifeTableFunctionsFunction({})
        };
    };
}
exports.curryAddAlgorithmWithLifeTableFunctionsFunction = curryAddAlgorithmWithLifeTableFunctionsFunction;
function curryAddAlgorithmReturnsGetHealthAgeFunction(cox, coxJson, refPop) {
    return (addedCox) => {
        addedCox;
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            addLifeTable: add_life_table_1.curryAddLifeTableFunctionWithGetHealthAge(cox, coxJson, refPop),
            getHealthAge: get_health_age_1.curryGetHeathAgeFunction(refPop),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            withData: algorithm_evaluator_1.curryWithDataAndGetHealthAgeFunction({})
        };
    };
}
exports.curryAddAlgorithmReturnsGetHealthAgeFunction = curryAddAlgorithmReturnsGetHealthAgeFunction;
function curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(cox, coxJson, refPop, refLifeTable) {
    return () => {
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            getHealthAge: get_health_age_1.curryGetHeathAgeFunction(refPop),
            getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyFunction(cox, refLifeTable),
            getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostFunction(coxJson.causeDeletedRef, refLifeTable),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            withData: algorithm_evaluator_1.curryFullWithDataFunction({})
        };
    };
}
exports.curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions = curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions;
//# sourceMappingURL=add-algorithm.js.map