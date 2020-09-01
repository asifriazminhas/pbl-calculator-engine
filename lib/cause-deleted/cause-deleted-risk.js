"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCauseDeleted = addCauseDeleted;

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _model = require("../engine/model");

var _data = require("../engine/data");

var _derivedField = require("../engine/data-field/derived-field/derived-field");

var _covariate = require("../engine/data-field/covariate/covariate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Adds cause deleted methods to the model argument
 *
 * @export
 * @param {Model} model The Model argument to augment. Each algorithm
 * object within the model will be extended to add cause deleted methods
 * to it
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the
 * reference exposure values to use for each algorithm when calculating
 * cause deleted
 * @returns {CauseDeletedModel}
 */
function addCauseDeleted(model, riskFactorRef) {
  return _model.ModelFactory.extendModel(model, {
    updateCauseDeletedRef: updateCauseDeletedRef
  }, getCauseDeletedCoxProperties(model, riskFactorRef));
}

function getCauseDeletedRisk(externalPredictors, riskFactors, data, time) {
  var _this = this;

  // Add in the external predictors, replacing any current predictors which
  // match up with it
  var updatedAlgorithm = externalPredictors.reduce(function (currentAlgorithm, predictor) {
    return currentAlgorithm.replaceCovariate(predictor);
  }, this); // Remove all the covariates for this risk factor which are not part of the
  // external predictors

  updatedAlgorithm.covariates = updatedAlgorithm.covariates.filter(function (covariate) {
    var isPartOfGroup = riskFactors.find(function (riskFactor) {
      return covariate.isPartOfGroup(riskFactor) === true;
    }) !== undefined;

    if (isPartOfGroup === true) {
      var isExternalPredictor = externalPredictors.find(function (predictor) {
        return predictor.name === covariate.name;
      }) !== undefined;
      return isExternalPredictor;
    } else {
      return true;
    }
  }); // Risk calculated with the new algorithm

  var externalRisk = updatedAlgorithm.getRiskToTime(data, time);
  var referenceData = (0, _flatten2.default)(riskFactors.map(function (riskFactor) {
    return _this.riskFactorRef[riskFactor];
  }));
  var newData = data.concat(referenceData // Get all the reference datum objects which are not part of the input data
  .filter(function (refDatum) {
    try {
      (0, _data.findDatumWithName)(refDatum.name, data);
      return false;
    } catch (err) {
      return true;
    }
  }) // For each reference datum objects that is not present in the
  // input data arg, construct the datum object for it using the
  // input data. If we cannot construct it then return the ref datum itself
  .map(function (refDatum) {
    var fieldForRefDatum = _this.findDataField(refDatum.name);

    if (fieldForRefDatum instanceof _derivedField.DerivedField) {
      return {
        name: refDatum.name,
        coefficent: fieldForRefDatum.calculateCoefficent(fieldForRefDatum.calculateDataToCalculateCoefficent(data, _this.userFunctions, _this.tables), _this.userFunctions, _this.tables)
      };
    } else if (fieldForRefDatum instanceof _covariate.Covariate) {
      return {
        name: refDatum.name,
        coefficent: fieldForRefDatum.calculateCoefficient(fieldForRefDatum.calculateDataToCalculateCoefficent(data, _this.userFunctions, _this.tables), _this.userFunctions, _this.tables)
      };
    } else {
      return refDatum;
    }
  })); // Risk calculated by replacing certain profile values with the exposure
  // reference values

  var causeDeletedRisk = updatedAlgorithm.getRiskToTime(updateDataWithReference(newData, referenceData), time);
  var causeDeletedRiskEffectExternal = externalRisk - causeDeletedRisk;
  var originalRisk = this.getRiskToTime(data, time);
  return causeDeletedRiskEffectExternal - originalRisk;
}

function updateCauseDeletedRef(newReference) {
  return _model.ModelFactory.extendModel(this, {
    updateCauseDeletedRef: updateCauseDeletedRef
  }, getCauseDeletedCoxProperties(this, newReference));
}

function getCauseDeletedCoxProperties(model, causeDeletedRef) {
  return model.algorithms.map(function (modelAlgorithm) {
    var riskFactorRefForCurrentAlgorithm = causeDeletedRef.find(function (ref) {
      // Check whether the current reference is for this algorithm
      return modelAlgorithm.predicate.getPredicateResult([{
        name: ref.sexVariable,
        coefficent: ref.sexValue
      }]);
    });

    if (!riskFactorRefForCurrentAlgorithm) {
      throw new Error("No exposure reference object for algorithm ".concat(modelAlgorithm.algorithm.name));
    }

    return {
      riskFactorRef: riskFactorRefForCurrentAlgorithm.ref,
      getCauseDeletedRisk: getCauseDeletedRisk
    };
  });
}

function updateDataWithReference(data, referenceData) {
  var dataUpdate = referenceData.map(function (refDatum) {
    var datumInData = (0, _data.findDatumWithName)(refDatum.name, data);

    if (refDatum.clamp !== undefined) {
      var refCoefficient = Number(refDatum.coefficent);
      var inputCoefficient = Number(datumInData.coefficent);

      if (inputCoefficient < refCoefficient && refDatum.clamp.lower === true) {
        return {
          name: refDatum.name,
          coefficent: refDatum.coefficent
        };
      } else if (inputCoefficient > refCoefficient && refDatum.clamp.upper === true) {
        return {
          name: refDatum.name,
          coefficent: refDatum.coefficent
        };
      } else {
        return datumInData;
      }
    }

    return refDatum;
  });
  return (0, _data.updateDataWithData)(data, dataUpdate);
}
//# sourceMappingURL=cause-deleted-risk.js.map