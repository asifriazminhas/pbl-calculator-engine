"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_1 = require("../algorithm");
class SimpleAlgorithm extends algorithm_1.Algorithm {
    buildDataNameReport() {
        throw new Error(this.buildDataNameReport.name + ' is not implemented');
    }
    evaluate(data) {
        return this.output.calculateCoefficent(data, this.userFunctions, this.tables);
    }
}
exports.SimpleAlgorithm = SimpleAlgorithm;
//# sourceMappingURL=simple-algorithm.js.map