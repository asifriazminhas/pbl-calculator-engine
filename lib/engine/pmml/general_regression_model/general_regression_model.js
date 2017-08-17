"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoxRegressionModelType = 'CoxRegression';
exports.LogisticRegressionModelType = 'logisticRegression';
function mergeGeneralRegressionModel(generalRegressionModelOne, generalRegressionModelTwo) {
    return Object.assign({}, generalRegressionModelOne, generalRegressionModelTwo);
}
exports.mergeGeneralRegressionModel = mergeGeneralRegressionModel;
//# sourceMappingURL=general_regression_model.js.map