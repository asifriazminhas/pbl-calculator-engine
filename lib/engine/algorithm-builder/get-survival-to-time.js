"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../cox/cox");
function curryGetSurvivalToTimeFunction(cox) {
    return (data, time) => {
        return cox_1.getSurvivalToTime(cox, data, time);
    };
}
exports.curryGetSurvivalToTimeFunction = curryGetSurvivalToTimeFunction;
//# sourceMappingURL=get-survival-to-time.js.map