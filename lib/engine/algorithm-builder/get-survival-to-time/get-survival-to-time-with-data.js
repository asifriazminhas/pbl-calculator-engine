"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../../cox/cox");
function curryGetSurvivalToTimeWithDataFunction(cox) {
    return (data, time) => {
        return cox_1.getSurvivalToTime(cox, data, time);
    };
}
exports.curryGetSurvivalToTimeWithDataFunction = curryGetSurvivalToTimeWithDataFunction;
//# sourceMappingURL=get-survival-to-time-with-data.js.map