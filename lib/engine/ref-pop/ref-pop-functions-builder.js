"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_pop_functions_1 = require("./ref-pop-functions");
exports.RefPopFunctionsBuilder = {
    withModel: model => {
        return {
            withRefPop: refPop => {
                return new ref_pop_functions_1.RefPopFunctions(model, refPop);
            },
        };
    },
};
//# sourceMappingURL=ref-pop-functions-builder.js.map