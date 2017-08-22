"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../../cox/cox");
function curryGetRiskToTimeWithDataFunction(cox) {
    return (data, time) => {
        return cox_1.getRiskToTime(cox, data, time);
    };
}
exports.curryGetRiskToTimeWithDataFunction = curryGetRiskToTimeWithDataFunction;
//# sourceMappingURL=get-risk-to-time-with-data.js.map