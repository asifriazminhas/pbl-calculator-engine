"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoxSurvivalAlgorithm = void 0;

var _sortedLastIndexBy2 = _interopRequireDefault(require("lodash/sortedLastIndexBy"));

var _regressionAlgorithm = require("../regression-algorithm");

var _bins = require("./bins/bins");

var _moment = _interopRequireDefault(require("moment"));

var _calibration = require("./calibration/calibration");

var _baseline = require("../baseline/baseline");

var _nonInteractionCovariate = require("../../../data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var _calibrationErrors = require("./calibration/calibration-errors");

var _predicate = require("../../../predicate/predicate");

var _predicateErrors = require("../../../predicate/predicate-errors");

var _debugRisk = require("../../../../debug/debug-risk");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CoxSurvivalAlgorithm = /*#__PURE__*/function (_RegressionAlgorithm) {
  _inherits(CoxSurvivalAlgorithm, _RegressionAlgorithm);

  var _super = _createSuper(CoxSurvivalAlgorithm);

  function CoxSurvivalAlgorithm(coxSurvivalAlgorithmJson) {
    var _this;

    _classCallCheck(this, CoxSurvivalAlgorithm);

    _this = _super.call(this, coxSurvivalAlgorithmJson);
    _this.maximumTime = coxSurvivalAlgorithmJson.maximumTime;
    _this.baseline = new _baseline.Baseline(coxSurvivalAlgorithmJson.baseline);
    _this.bins = coxSurvivalAlgorithmJson.bins ? new _bins.Bins(coxSurvivalAlgorithmJson.bins) : undefined;
    _this.timeMetric = coxSurvivalAlgorithmJson.timeMetric;
    _this.calibration = new _calibration.Calibration();
    return _this;
  }

  _createClass(CoxSurvivalAlgorithm, [{
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
        baseline: new _baseline.Baseline(newBaseline)
      });
      return Object.setPrototypeOf(updatedAlgorithm, CoxSurvivalAlgorithm.prototype);
    }
  }, {
    key: "addPredictor",
    value: function addPredictor(predictor) {
      var newCovariate = new _nonInteractionCovariate.NonInteractionCovariate({
        dataFieldType: 0,
        beta: predictor.betaCoefficent,
        referencePoint: predictor.referencePoint ? predictor.referencePoint : 0,
        name: predictor.name,
        groups: [],
        isRequired: true,
        isRecommended: false,
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
        var calibrationFactorObjects = _predicate.Predicate.getFirstTruePredicateObject(calibrationJson.map(function (currentCalibrationJson) {
          return Object.assign({}, currentCalibrationJson, {
            predicate: new _predicate.Predicate(currentCalibrationJson.predicate.equation, currentCalibrationJson.predicate.variables)
          });
        }), predicateData).calibrationFactorObjects;

        var calibration = calibrationFactorObjects.reduce(function (calibrationFactors, currentCalibrationFactorObject) {
          calibrationFactors[currentCalibrationFactorObject.age] = currentCalibrationFactorObject.factor;
          return calibrationFactors;
        }, {});
        return Object.setPrototypeOf(Object.assign({}, this, {
          calibration: new _calibration.Calibration(calibration)
        }), CoxSurvivalAlgorithm.prototype);
      } catch (err) {
        if (err instanceof _predicateErrors.NoPredicateObjectFoundError) {
          console.warn(new _calibrationErrors.NoCalibrationFoundError(predicateData).message);
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
      var _iterator = _createForOfIteratorHelper(this.covariates),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      throw new Error("No DataField found with name ".concat(name));
    }
  }, {
    key: "getRequiredVariables",
    value: function getRequiredVariables() {
      return this.getAllFields().filter(function (field) {
        return field.isRequired;
      });
    }
  }, {
    key: "getRecommendedVariables",
    value: function getRecommendedVariables() {
      return this.getAllFields().filter(function (field) {
        return field.isRecommended;
      });
    }
  }, {
    key: "getSurvivalToTimeWithBins",
    value: function getSurvivalToTimeWithBins(data, time) {
      var _this2 = this;

      _debugRisk.debugRisk.startNewCalculation();

      var score = this.calculateScore(data);
      var binDataForScore = this.bins.getBinDataForScore(score);
      var today = (0, _moment.default)();
      today.startOf('day');
      var startOfDayForTimeArg = (0, _moment.default)(time);
      startOfDayForTimeArg.startOf('day');
      var timeDifference = Math.abs(today.diff(startOfDayForTimeArg, this.timeMetric));
      var binDataForTimeIndex = (0, _sortedLastIndexBy2.default)(binDataForScore, {
        time: timeDifference,
        survivalPercent: 0
      }, function (binDataRow) {
        return binDataRow.time ? binDataRow.time : _this2.maximumTime;
      });
      var survival = binDataForTimeIndex === 0 ? 0.99 : binDataForScore[binDataForTimeIndex - 1].survivalPercent / 100;

      _debugRisk.debugRisk.addEndDebugInfo(this.covariates, data, score, 1 - survival);

      return survival;
    }
  }, {
    key: "getRiskToTimeWithoutBins",
    value: function getRiskToTimeWithoutBins(data, time) {
      _debugRisk.debugRisk.startNewCalculation();

      var formattedTime;

      if (!time) {
        formattedTime = (0, _moment.default)().startOf('day');
        formattedTime.add(this.maximumTime, this.timeMetric);
      } else if (time instanceof Date) {
        formattedTime = (0, _moment.default)(time).startOf('day');
      } else {
        formattedTime = time;
      }

      var score = this.calculateScore(data); // Get how many days into the future we want to predict the risk

      var predictionTimeInDays = formattedTime.diff((0, _moment.default)().startOf('day'), 'days'); // baseline*calibration*e^score

      var exponentiatedScoreTimesBaselineTimesCalibration = this.baseline.getBaselineHazard(predictionTimeInDays) * this.calibration.getCalibrationFactorForData(data) * Math.pow(Math.E, score); // 1 - e^(-previousValue)

      var maximumTimeRiskProbability = 1 - Math.pow(Math.E, -exponentiatedScoreTimesBaselineTimesCalibration);

      _debugRisk.debugRisk.addEndDebugInfo(this.covariates, data, score, maximumTimeRiskProbability);

      return maximumTimeRiskProbability * this.getTimeMultiplier(formattedTime);
    }
  }, {
    key: "getTimeMultiplier",
    value: function getTimeMultiplier(time) {
      return Math.min(Math.abs((0, _moment.default)().startOf('day').diff(time, this.timeMetric, true)) / this.maximumTime, 1);
    }
  }]);

  return CoxSurvivalAlgorithm;
}(_regressionAlgorithm.RegressionAlgorithm);

exports.CoxSurvivalAlgorithm = CoxSurvivalAlgorithm;
//# sourceMappingURL=cox-survival-algorithm.js.map