"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regression_algorithm_1 = require("../regression-algorithm/regression-algorithm");
function updateBaselineForModel(model, newBaseline) {
    return Object.assign({}, model, {
        algorithm: regression_algorithm_1.updateBaseline(model.algorithm, newBaseline),
    });
}
exports.updateBaselineForModel = updateBaselineForModel;
//# sourceMappingURL=single-algorithm-model.js.map