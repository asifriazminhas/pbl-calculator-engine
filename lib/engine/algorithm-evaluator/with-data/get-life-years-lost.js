"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const with_data_1 = require("./with-data");
function curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction(currentResult) {
    return (riskFactor) => {
        //TODO Figure out the any
        const lifeYearsLost = Object.assign({}, currentResult.lifeYearsLost, { [riskFactor]: Math.random() });
        return with_data_1.getWithDataAndLifeTableFunctionsFunctionReturn(Object.assign({}, currentResult, { lifeYearsLost }));
    };
}
exports.curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction = curryGetLifeYearsLostReturnsWithDataAndLifeTableFunction;
function curryGetLifeYearsLostReturnsFullWithDataFunction(currentResult) {
    return (riskFactor) => {
        //TODO Figure out the any
        const lifeYearsLost = Object.assign({}, currentResult.lifeYearsLost, { [riskFactor]: Math.random() });
        return with_data_1.getFullWithDataFunctionReturn(Object.assign({}, currentResult, { lifeYearsLost }));
    };
}
exports.curryGetLifeYearsLostReturnsFullWithDataFunction = curryGetLifeYearsLostReturnsFullWithDataFunction;
//# sourceMappingURL=get-life-years-lost.js.map