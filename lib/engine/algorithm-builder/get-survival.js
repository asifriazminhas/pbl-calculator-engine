"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../cox/cox");
function curryGetSurvivalFunction(cox) {
    return (data) => {
        return cox_1.getSurvival(cox, data);
    };
}
exports.curryGetSurvivalFunction = curryGetSurvivalFunction;
//# sourceMappingURL=get-survival.js.map