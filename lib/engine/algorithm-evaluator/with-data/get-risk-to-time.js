"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const with_data_1 = require("./with-data");
function curryGetRiskToTimeReturnsBaseWithDataFunction(currentResult) {
    return (time) => {
        time;
        const riskToTime = Math.random();
        return with_data_1.getBaseWithDataFunctionReturn(Object.assign({}, currentResult, { riskToTime }));
    };
}
exports.curryGetRiskToTimeReturnsBaseWithDataFunction = curryGetRiskToTimeReturnsBaseWithDataFunction;
function curryGetRiskToTimeReturnsWithDataAndGetHealthAge(currentResult) {
    return (time) => {
        time;
        const riskToTime = Math.random();
        return with_data_1.getWithDataAndGetHealthAgeFunctionReturn(Object.assign({}, currentResult, { riskToTime }));
    };
}
exports.curryGetRiskToTimeReturnsWithDataAndGetHealthAge = curryGetRiskToTimeReturnsWithDataAndGetHealthAge;
function curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy(currentResult) {
    return (time) => {
        time;
        const riskToTime = Math.random();
        return with_data_1.getWithDataAndLifeTableFunctionsFunctionReturn(Object.assign({}, currentResult, { riskToTime }));
    };
}
exports.curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy = curryGetRiskToTimeReturnsWithDataAndGetLifeExpectancy;
function curryGetRiskToTimeReturnsFullWithData(currentResult) {
    return (time) => {
        time;
        const riskToTime = Math.random();
        return with_data_1.getFullWithDataFunctionReturn(Object.assign({}, currentResult, { riskToTime }));
    };
}
exports.curryGetRiskToTimeReturnsFullWithData = curryGetRiskToTimeReturnsFullWithData;
//# sourceMappingURL=get-risk-to-time.js.map