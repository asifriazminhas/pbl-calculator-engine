"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_age_1 = require("../health-age/health-age");
function curryGetHeathAgeFunction(refPop) {
    return (data) => {
        return health_age_1.getHealthAge(refPop, data);
    };
}
exports.curryGetHeathAgeFunction = curryGetHeathAgeFunction;
//# sourceMappingURL=get-health-age.js.map