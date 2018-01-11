"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../cox");
function getHealthAge(refPop, data, cox, oneYearRisk = cox_1.getRiskToTime(cox, data)) {
    return refPop.reduce((currentRefPopRow, refPopRow) => {
        if (Math.abs(refPopRow.outcomeRisk - oneYearRisk) <
            Math.abs(currentRefPopRow.outcomeRisk - oneYearRisk)) {
            return refPopRow;
        }
        return currentRefPopRow;
    }, refPop[0]).age;
}
exports.getHealthAge = getHealthAge;
//# sourceMappingURL=health-age.js.map