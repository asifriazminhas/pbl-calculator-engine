"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_years_lost_1 = require("../life-years-lost/life-years-lost");
//TODO Fix this
function curryGetLifeYearsLostFunction(causeDeletedRef, refLifeTable) {
    return (data, riskFactor) => {
        return life_years_lost_1.getLifeYearsLost(causeDeletedRef, refLifeTable, data, riskFactor);
    };
}
exports.curryGetLifeYearsLostFunction = curryGetLifeYearsLostFunction;
//# sourceMappingURL=get-life-years-lost.js.map