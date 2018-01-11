"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function formatCoefficentForComponent(coefficent, covariate) {
    if (coefficent instanceof moment || coefficent instanceof Date) {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    }
    else if (coefficent === null ||
        coefficent === undefined ||
        coefficent === 'NA' ||
        isNaN(coefficent)) {
        return covariate.referencePoint;
    }
    else {
        return Number(coefficent);
    }
}
exports.formatCoefficentForComponent = formatCoefficentForComponent;
//# sourceMappingURL=coefficent.js.map