"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const with_data_1 = require("./with-data");
function curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction(currentResult) {
    return () => {
        const healthAge = Math.random();
        return with_data_1.getWithDataAndGetHealthAgeFunctionReturn(Object.assign({}, currentResult, { healthAge }));
    };
}
exports.curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction = curryGetHealthAgeReturnsWithDataAndGetHealthAgeFunction;
function curryGetHealthAgeReturnsFullWithDataFunction(currentResult) {
    return () => {
        const healthAge = Math.random();
        return with_data_1.getFullWithDataFunctionReturn(Object.assign({}, currentResult, { healthAge }));
    };
}
exports.curryGetHealthAgeReturnsFullWithDataFunction = curryGetHealthAgeReturnsFullWithDataFunction;
//# sourceMappingURL=get-health-age.js.map