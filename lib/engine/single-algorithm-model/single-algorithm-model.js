"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_1 = require("../algorithm");
function updateBaselineForModel(model, newBaseline) {
    return Object.assign({}, model, {
        algorithm: algorithm_1.updateBaseline(model.algorithm, newBaseline),
    });
}
exports.updateBaselineForModel = updateBaselineForModel;
//# sourceMappingURL=single-algorithm-model.js.map