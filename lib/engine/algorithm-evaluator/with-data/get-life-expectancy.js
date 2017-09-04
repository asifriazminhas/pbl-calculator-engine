"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const with_data_1 = require("./with-data");
function curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions(currentResult) {
    return () => {
        const lifeExpectancy = Math.random();
        return with_data_1.getWithDataAndLifeTableFunctionsFunctionReturn(Object.assign({}, currentResult, { lifeExpectancy }));
    };
}
exports.curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions = curryGetLifeExpectancyReturnsWithDataAndLifeTablFunctions;
function curryGetLifeExpectancyReturnsFullWithDataFunction(currentResult) {
    return () => {
        const lifeExpectancy = Math.random();
        return with_data_1.getFullWithDataFunctionReturn(Object.assign({}, currentResult, { lifeExpectancy }));
    };
}
exports.curryGetLifeExpectancyReturnsFullWithDataFunction = curryGetLifeExpectancyReturnsFullWithDataFunction;
//# sourceMappingURL=get-life-expectancy.js.map