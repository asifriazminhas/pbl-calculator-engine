"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../cox/cox");
function curryGetRiskFunction(cox) {
    return (data) => {
        return cox_1.getRisk(cox, data);
    };
}
exports.curryGetRiskFunction = curryGetRiskFunction;
//# sourceMappingURL=get-risk-to-time.js.map