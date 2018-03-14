"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicate_1 = require("./predicate/predicate");
const predicate_errors_1 = require("./predicate/predicate-errors");
function getAlgorithmJsonForData(multipleAlgorithmModel, data) {
    try {
        return predicate_1.getFirstTruePredicateObject(multipleAlgorithmModel.algorithms, data).algorithm;
    }
    catch (err) {
        if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
            throw new Error(`No matched algorithm found`);
        }
        else {
            throw err;
        }
    }
}
exports.getAlgorithmJsonForData = getAlgorithmJsonForData;
//# sourceMappingURL=multiple-algorithm-model-json.js.map