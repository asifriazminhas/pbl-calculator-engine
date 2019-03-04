"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoxRegressionModelType = 'CoxRegression';
exports.LogisticRegressionModelType = 'logisticRegression';
function mergeGeneralRegressionModel(generalRegressionModelOne, generalRegressionModelTwo) {
    if (generalRegressionModelOne && generalRegressionModelTwo) {
        const mergedProps = Object.keys(generalRegressionModelOne.$).reduce((currentMergedProps, currentProp) => {
            return Object.assign(currentMergedProps, {
                [currentProp]: generalRegressionModelTwo.$[currentProp] === '' ||
                    generalRegressionModelTwo.$[currentProp] === null ||
                    generalRegressionModelTwo.$[currentProp] === undefined
                    ? generalRegressionModelOne.$[currentProp]
                    : generalRegressionModelTwo.$[currentProp],
            });
        }, {});
        return Object.assign({}, generalRegressionModelOne, generalRegressionModelTwo, {
            $: mergedProps,
            ParameterList: generalRegressionModelOne.ParameterList.Parameter.length ===
                0
                ? generalRegressionModelTwo.ParameterList
                : generalRegressionModelOne.ParameterList,
            ParamMatrix: generalRegressionModelOne.ParamMatrix.PCell.length === 0
                ? generalRegressionModelTwo.ParamMatrix
                : generalRegressionModelOne.ParamMatrix,
            CovariateList: generalRegressionModelOne.CovariateList.Predictor.length ===
                0
                ? generalRegressionModelTwo.CovariateList
                : generalRegressionModelOne.CovariateList,
        });
    }
    else if (generalRegressionModelOne && !generalRegressionModelTwo) {
        return generalRegressionModelOne;
    }
    else if (!generalRegressionModelOne && generalRegressionModelTwo) {
        return generalRegressionModelTwo;
    }
    else {
        return undefined;
    }
}
exports.mergeGeneralRegressionModel = mergeGeneralRegressionModel;
//# sourceMappingURL=general_regression_model.js.map