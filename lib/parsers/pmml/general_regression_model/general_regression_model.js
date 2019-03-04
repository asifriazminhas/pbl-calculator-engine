"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoxRegressionModelType = 'CoxRegression';
exports.LogisticRegressionModelType = 'logisticRegression';

function mergeGeneralRegressionModel(generalRegressionModelOne, generalRegressionModelTwo) {
  if (generalRegressionModelOne && generalRegressionModelTwo) {
    var mergedProps = Object.keys(generalRegressionModelOne.$).reduce(function (currentMergedProps, currentProp) {
      return Object.assign(currentMergedProps, _defineProperty({}, currentProp, generalRegressionModelTwo.$[currentProp] === '' || generalRegressionModelTwo.$[currentProp] === null || generalRegressionModelTwo.$[currentProp] === undefined ? generalRegressionModelOne.$[currentProp] : generalRegressionModelTwo.$[currentProp]));
    }, {});
    return Object.assign({}, generalRegressionModelOne, generalRegressionModelTwo, {
      $: mergedProps,
      ParameterList: generalRegressionModelOne.ParameterList.Parameter.length === 0 ? generalRegressionModelTwo.ParameterList : generalRegressionModelOne.ParameterList,
      ParamMatrix: generalRegressionModelOne.ParamMatrix.PCell.length === 0 ? generalRegressionModelTwo.ParamMatrix : generalRegressionModelOne.ParamMatrix,
      CovariateList: generalRegressionModelOne.CovariateList.Predictor.length === 0 ? generalRegressionModelTwo.CovariateList : generalRegressionModelOne.CovariateList
    });
  } else if (generalRegressionModelOne && !generalRegressionModelTwo) {
    return generalRegressionModelOne;
  } else if (!generalRegressionModelOne && generalRegressionModelTwo) {
    return generalRegressionModelTwo;
  } else {
    return undefined;
  }
}

exports.mergeGeneralRegressionModel = mergeGeneralRegressionModel;
//# sourceMappingURL=general_regression_model.js.map