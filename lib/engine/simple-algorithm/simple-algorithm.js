"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const derived_field_1 = require("../derived-field/derived-field");
function evaluate(algorithm, data) {
    return derived_field_1.calculateCoefficent(algorithm.output, data, algorithm.userFunctions, algorithm.tables);
}
exports.evaluate = evaluate;
//# sourceMappingURL=simple-algorithm.js.map