"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const health_age_1 = require("./health-age");
class RefPopFunctions {
    constructor(model, refPop) {
        this.model = model;
        this.refPop = refPop;
    }
    getHealthAge(data) {
        return health_age_1.getHealthAge(this.refPop, data, model_1.getAlgorithmForModelAndData(this.model, data));
    }
}
exports.RefPopFunctions = RefPopFunctions;
//# sourceMappingURL=ref-pop-functions.js.map