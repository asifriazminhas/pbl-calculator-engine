"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../cox/cox");
function curryGetSurvivalToTimeFunctionWithCox(cox) {
    return (data, time) => {
        return cox_1.getSurvivalToTime(cox, data, time);
    };
}
exports.curryGetSurvivalToTimeFunctionWithCox = curryGetSurvivalToTimeFunctionWithCox;
//# sourceMappingURL=get-survival-to-time.js.map