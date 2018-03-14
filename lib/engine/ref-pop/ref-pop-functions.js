"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const health_age_1 = require("./health-age");
const predicate_1 = require("../multiple-algorithm-model/predicate/predicate");
const predicate_errors_1 = require("../multiple-algorithm-model/predicate/predicate-errors");
class RefPopFunctions {
    constructor(model, refPop) {
        this.getHealthAge = (data) => {
            let refPopToUse;
            if (this.refPop[0].predicate) {
                try {
                    refPopToUse = predicate_1.getFirstTruePredicateObject(this.refPop, data).refPop;
                }
                catch (err) {
                    if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
                        throw new Error(`No matched ref pop found for data ${JSON.stringify(data, null, 2)}`);
                    }
                    throw err;
                }
            }
            else {
                refPopToUse = this.refPop;
            }
            return health_age_1.getHealthAge(refPopToUse, data, model_1.getAlgorithmForModelAndData(this.model, data));
        };
        this.model = model;
        this.refPop = refPop;
    }
}
exports.RefPopFunctions = RefPopFunctions;
//# sourceMappingURL=ref-pop-functions.js.map