"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function formatCoefficentForComponent(coefficent, covariate) {
    if (coefficent === null ||
        coefficent === undefined ||
        coefficent === 'NA') {
        return covariate.referencePoint;
    }
    else if (coefficent instanceof moment ||
        coefficent instanceof Date ||
        isNaN(Number(coefficent))) {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    }
    else {
        return Number(coefficent);
    }
}
exports.formatCoefficentForComponent = formatCoefficentForComponent;
//# sourceMappingURL=coefficent.js.map