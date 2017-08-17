"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("./covariate");
function parseCoxJsonToCox(coxJson) {
    return Object.assign({}, coxJson, {
        covariates: coxJson.covariates.map((covariateJson) => {
            return covariate_1.parseCovariateJsonToCovariate(covariateJson, coxJson.covariates, coxJson.derivedFields);
        })
    });
}
exports.parseCoxJsonToCox = parseCoxJsonToCox;
//# sourceMappingURL=cox.js.map