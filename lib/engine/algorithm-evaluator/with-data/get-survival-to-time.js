"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const with_data_1 = require("./with-data");
function curryGetSurvivalToTimeReturnsBaseWithDataFunction(currentResult) {
    return (time) => {
        time;
        const survivalToTime = Math.random();
        return with_data_1.getBaseWithDataFunctionReturn(Object.assign({}, currentResult, { survivalToTime }));
    };
}
exports.curryGetSurvivalToTimeReturnsBaseWithDataFunction = curryGetSurvivalToTimeReturnsBaseWithDataFunction;
function curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge(currentResult) {
    return (time) => {
        time;
        const survivalToTime = Math.random();
        return with_data_1.getWithDataAndGetHealthAgeFunctionReturn(Object.assign({}, currentResult, { survivalToTime }));
    };
}
exports.curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge = curryGetSurvivalToTimeReturnsWithDataAndGetHealthAge;
function curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy(currentResult) {
    return (time) => {
        time;
        const survivalToTime = Math.random();
        return with_data_1.getWithDataAndLifeTableFunctionsFunctionReturn(Object.assign({}, currentResult, { survivalToTime }));
    };
}
exports.curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy = curryGetSurvivalToTimeReturnsWithDataAndGetLifeExpectancy;
function curryGetSurvivalToTimeReturnsFullWithData(currentResult) {
    return (time) => {
        time;
        const survivalToTime = Math.random();
        return with_data_1.getFullWithDataFunctionReturn(Object.assign({}, currentResult, { survivalToTime }));
    };
}
exports.curryGetSurvivalToTimeReturnsFullWithData = curryGetSurvivalToTimeReturnsFullWithData;
//# sourceMappingURL=get-survival-to-time.js.map