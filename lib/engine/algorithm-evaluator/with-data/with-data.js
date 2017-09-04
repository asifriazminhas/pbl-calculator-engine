"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_survival_to_time_1 = require("./get-survival-to-time");
const get_risk_to_time_1 = require("./get-risk-to-time");
const get_life_expectancy_1 = require("./get-life-expectancy");
const get_health_age_1 = require("./get-health-age");
const get_life_years_lost_1 = require("./get-life-years-lost");
function getBaseWithDataFunctionReturn(currentResult) {
    return {
        getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeReturnsBaseWithDataFunction(currentResult),
        getRiskToTime: get_risk_to_time_1.curryGetRiskToTimeReturnsBaseWithDataFunction(currentResult),
        end: () => {
            return currentResult;
        }
    };
}
exports.getBaseWithDataFunctionReturn = getBaseWithDataFunctionReturn;
function curryBaseWithDataFunction(currentResult) {
    return () => {
        return getBaseWithDataFunctionReturn(currentResult);
    };
}
exports.curryBaseWithDataFunction = curryBaseWithDataFunction;
function getWithDataAndLifeTableFunctionsFunctionReturn(currentResult) {
    return {
        getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy(currentResult),
        getRiskToTime: get_risk_to_time_1.curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy(currentResult),
        getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions(currentResult),
        getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction(currentResult),
        end: () => {
            return currentResult;
        }
    };
}
exports.getWithDataAndLifeTableFunctionsFunctionReturn = getWithDataAndLifeTableFunctionsFunctionReturn;
function curryWithDataAndLifeTableFunctionsFunction(currentResult) {
    return () => {
        return getWithDataAndLifeTableFunctionsFunctionReturn(currentResult);
    };
}
exports.curryWithDataAndLifeTableFunctionsFunction = curryWithDataAndLifeTableFunctionsFunction;
function getWithDataAndGetHealthAgeFunctionReturn(currentResult) {
    return {
        getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge(currentResult),
        getRiskToTime: get_risk_to_time_1.curryGetRiskToTimeReturnsWithDataAndGetHealthAge(currentResult),
        getHealthAge: get_health_age_1.curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction(currentResult),
        end: () => {
            return currentResult;
        }
    };
}
exports.getWithDataAndGetHealthAgeFunctionReturn = getWithDataAndGetHealthAgeFunctionReturn;
function curryWithDataAndGetHealthAgeFunction(currentResult) {
    return () => {
        return getWithDataAndGetHealthAgeFunctionReturn(currentResult);
    };
}
exports.curryWithDataAndGetHealthAgeFunction = curryWithDataAndGetHealthAgeFunction;
function getFullWithDataFunctionReturn(currentResult) {
    return {
        getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeReturnsFullWithData(currentResult),
        getRiskToTime: get_risk_to_time_1.curryGetRiskToTimeReturnsFullWithData(currentResult),
        getLifeExpectancy: get_life_expectancy_1.curryGetLifeExpectancyReturnsFullWithDataFunction(currentResult),
        getLifeYearsLost: get_life_years_lost_1.curryGetLifeYearsLostReturnsFullWithDataFunction(currentResult),
        getHealthAge: get_health_age_1.curryGetHealthAgeReturnsFullWithDataFunction(currentResult),
        end: () => {
            return currentResult;
        }
    };
}
exports.getFullWithDataFunctionReturn = getFullWithDataFunctionReturn;
function curryFullWithDataFunction(currentResult) {
    return () => {
        return getFullWithDataFunctionReturn(currentResult);
    };
}
exports.curryFullWithDataFunction = curryFullWithDataFunction;
//# sourceMappingURL=with-data.js.map