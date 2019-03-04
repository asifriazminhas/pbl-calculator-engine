"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var regression_algorithm_1 = require("../regression-algorithm");

var bins_1 = require("./bins/bins");

var moment = require("moment");

var lodash_1 = require("lodash");

var env_1 = require("../../../../util/env");

var calibration_1 = require("./calibration/calibration");

var baseline_1 = require("../baseline/baseline"); // tslint:disable-next-line:max-line-length


var non_interaction_covariate_1 = require("../../../data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var calibration_errors_1 = require("./calibration/calibration-errors");

var predicate_1 = require("../../../predicate/predicate");

var predicate_errors_1 = require("../../../predicate/predicate-errors");

var interaction_covariate_1 = require("../../../data-field/covariate/interaction-covariate/interaction-covariate");

var CoxSurvivalAlgorithm =
/*#__PURE__*/
function (_regression_algorithm) {
  _inherits(CoxSurvivalAlgorithm, _regression_algorithm);

  function CoxSurvivalAlgorithm(coxSurvivalAlgorithmJson) {
    var _this;

    _classCallCheck(this, CoxSurvivalAlgorithm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CoxSurvivalAlgorithm).call(this, coxSurvivalAlgorithmJson));
    _this.maximumTime = coxSurvivalAlgorithmJson.maximumTime;
    _this.baseline = new baseline_1.Baseline(coxSurvivalAlgorithmJson.baseline);
    _this.bins = coxSurvivalAlgorithmJson.bins ? new bins_1.Bins(coxSurvivalAlgorithmJson.bins) : undefined;
    _this.timeMetric = coxSurvivalAlgorithmJson.timeMetric;
    _this.calibration = new calibration_1.Calibration();
    return _this;
  }

  _createClass(CoxSurvivalAlgorithm, [{
    key: "buildDataNameReport",
    value: function buildDataNameReport(headers) {
      var found = [];
      var missingRequired = [];
      var missingOptional = [];

      var ignored = _toConsumableArray(headers);

      this.covariates.forEach(function (covariate) {
        if (covariate.customFunction) return;
        if (covariate instanceof interaction_covariate_1.InteractionCovariate) return;
        var headerWasProvided = headers.includes(covariate.name);

        if (headerWasProvided) {
          found.push(covariate);
          ignored.splice(ignored.indexOf(covariate.name), 1);
        } else {
          if (covariate.isRequired) {
            missingRequired.push(covariate);
          } else {
            missingOptional.push(covariate);
          }
        }
      });
      return {
        found: this.sortCovariatesByName(found),
        missingRequired: this.sortCovariatesByName(missingRequired),
        missingOptional: this.sortCovariatesByName(missingOptional),
        ignored: ignored.sort(function (a, b) {
          return a.localeCompare(b);
        })
      };
    }
  }, {
    key: "evaluate",
    value: function evaluate(data, time) {
      return this.getRiskToTime(data, time);
    }
  }, {
    key: "getRiskToTime",
    value: function getRiskToTime(data, time) {
      if (this.bins) {
        return 1 - this.getSurvivalToTimeWithBins(data, time);
      } else {
        return this.getRiskToTimeWithoutBins(data, time);
      }
    }
  }, {
    key: "getSurvivalToTime",
    value: function getSurvivalToTime(data, time) {
      return 1 - this.getRiskToTime(data, time);
    }
  }, {
    key: "updateBaseline",
    value: function updateBaseline(newBaseline) {
      var updatedAlgorithm = Object.assign({}, this, {
        baseline: new baseline_1.Baseline(newBaseline)
      });
      return Object.setPrototypeOf(updatedAlgorithm, CoxSurvivalAlgorithm.prototype);
    }
  }, {
    key: "addPredictor",
    value: function addPredictor(predictor) {
      var newCovariate = new non_interaction_covariate_1.NonInteractionCovariate({
        dataFieldType: 0,
        beta: predictor.betaCoefficent,
        referencePoint: predictor.referencePoint ? predictor.referencePoint : 0,
        name: predictor.name,
        groups: [],
        isRequired: false,
        metadata: {
          label: '',
          shortLabel: ''
        }
      }, undefined, undefined);
      return Object.setPrototypeOf(Object.assign({}, this, {
        covariates: this.covariates.concat(newCovariate)
      }), CoxSurvivalAlgorithm.prototype);
    }
  }, {
    key: "addCalibrationToAlgorithm",
    value: function addCalibrationToAlgorithm(calibrationJson, predicateData) {
      try {
        var calibrationFactorObjects = predicate_1.Predicate.getFirstTruePredicateObject(calibrationJson.map(function (currentCalibrationJson) {
          return Object.assign({}, currentCalibrationJson, {
            predicate: new predicate_1.Predicate(currentCalibrationJson.predicate.equation, currentCalibrationJson.predicate.variables)
          });
        }), predicateData).calibrationFactorObjects;
        var calibration = calibrationFactorObjects.reduce(function (calibrationFactors, currentCalibrationFactorObject) {
          calibrationFactors[currentCalibrationFactorObject.age] = currentCalibrationFactorObject.factor;
          return calibrationFactors;
        }, {});
        return Object.setPrototypeOf(Object.assign({}, this, {
          calibration: new calibration_1.Calibration(calibration)
        }), CoxSurvivalAlgorithm.prototype);
      } catch (err) {
        if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
          console.warn(new calibration_errors_1.NoCalibrationFoundError(predicateData).message);
          return this;
        } else {
          throw Error;
        }
      }
    }
    /**
     * Goes though all the fields part of this algorithm and tries to find one
     * whose name matches with the name arg. Throws an Error if no DataField is
     * found
     *
     * @param {string} name
     * @returns {DataField}
     * @memberof CoxSurvivalAlgorithm
     */

  }, {
    key: "findDataField",
    value: function findDataField(name) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.covariates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var covariate = _step.value;

          if (covariate.name === name) {
            return covariate;
          } else {
            var foundDescendantField = covariate.getDescendantFields().find(function (field) {
              return field.name === name;
            });

            if (foundDescendantField) {
              return foundDescendantField;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      throw new Error("No DataField found with name ".concat(name));
    }
  }, {
    key: "getSurvivalToTimeWithBins",
    value: function getSurvivalToTimeWithBins(data, time) {
      var _this2 = this;

      var score = this.calculateScore(data);
      var binDataForScore = this.bins.getBinDataForScore(score);
      var today = moment();
      today.startOf('day');
      var startOfDayForTimeArg = moment(time);
      startOfDayForTimeArg.startOf('day');
      var timeDifference = Math.abs(today.diff(startOfDayForTimeArg, this.timeMetric));
      var binDataForTimeIndex = lodash_1.sortedLastIndexBy(binDataForScore, {
        time: timeDifference,
        survivalPercent: 0
      }, function (binDataRow) {
        return binDataRow.time ? binDataRow.time : _this2.maximumTime;
      });
      return binDataForTimeIndex === 0 ? 0.99 : binDataForScore[binDataForTimeIndex - 1].survivalPercent / 100;
    }
  }, {
    key: "getRiskToTimeWithoutBins",
    value: function getRiskToTimeWithoutBins(data, time) {
      var formattedTime;

      if (!time) {
        formattedTime = moment().startOf('day');
        formattedTime.add(this.maximumTime, this.timeMetric);
      } else if (time instanceof Date) {
        formattedTime = moment(time).startOf('day');
      } else {
        formattedTime = time;
      }

      if (env_1.shouldLogDebugInfo() === true) {
        console.groupCollapsed("Predictors");
      }

      if (env_1.shouldLogDebugInfo()) {
        console.log("Baseline: ".concat(this.baseline));
      }

      if (env_1.shouldLogDebugInfo() === true) {
        console.groupEnd();
      }

      var score = this.calculateScore(data); // baseline*calibration*e^score

      var exponentiatedScoreTimesBaselineTimesCalibration = this.baseline.getBaselineForData(data) * this.calibration.getCalibrationFactorForData(data) * Math.pow(Math.E, score);
      var maximumTimeRiskProbability = 1 - Math.pow(Math.E, -exponentiatedScoreTimesBaselineTimesCalibration);
      return maximumTimeRiskProbability * this.getTimeMultiplier(formattedTime);
    }
  }, {
    key: "getTimeMultiplier",
    value: function getTimeMultiplier(time) {
      return Math.min(Math.abs(moment().startOf('day').diff(time, this.timeMetric, true)) / this.maximumTime, 1);
    }
  }, {
    key: "sortCovariatesByName",
    value: function sortCovariatesByName(covariates) {
      return covariates.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  }]);

  return CoxSurvivalAlgorithm;
}(regression_algorithm_1.RegressionAlgorithm);

exports.CoxSurvivalAlgorithm = CoxSurvivalAlgorithm;
//# sourceMappingURL=cox-survival-algorithm.js.map