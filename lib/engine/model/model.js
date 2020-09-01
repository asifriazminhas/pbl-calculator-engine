"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;

var _uniqBy2 = _interopRequireDefault(require("lodash/uniqBy"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _predicate = require("../predicate/predicate");

var _modelAlgorithm = require("./model-algorithm");

var _coxSurvivalAlgorithm = require("../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");

var _undefined = require("../../util/undefined");

var _errors = require("../errors");

var _predicateErrors = require("../predicate/predicate-errors");

var _dataField = require("../data-field/data-field");

var _algorithmType = require("../../parsers/json/algorithm-type");

var _simpleAlgorithm = require("../algorithm/simple-algorithm/simple-algorithm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Model = /*#__PURE__*/function () {
  function Model(modelJson) {
    _classCallCheck(this, Model);

    this.name = modelJson.name;
    this.algorithms = modelJson.algorithms.map(function (algorithmWithPredicate) {
      var algorithm;
      var algorithmJson = algorithmWithPredicate.algorithm;

      switch (algorithmJson.algorithmType) {
        case _algorithmType.AlgorithmType.CoxSurvivalAlgorithm:
          {
            algorithm = new _coxSurvivalAlgorithm.CoxSurvivalAlgorithm(algorithmJson);
            break;
          }

        case _algorithmType.AlgorithmType.SimpleAlgorithm:
          {
            algorithm = new _simpleAlgorithm.SimpleAlgorithm(algorithmJson);
            break;
          }

        default:
          {
            throw new Error("Trying to parse unknown algorithm JSON ".concat(algorithmJson));
          }
      }

      var predicate = new _predicate.Predicate(algorithmWithPredicate.predicate.equation, algorithmWithPredicate.predicate.variables);
      return new _modelAlgorithm.ModelAlgorithm(algorithm, predicate);
    });
    this.modelFields = modelJson.modelFields.map(function (modelField) {
      return new _dataField.DataField(modelField);
    });
  }

  _createClass(Model, [{
    key: "getAlgorithmForData",
    value: function getAlgorithmForData(data) {
      try {
        return _predicate.Predicate.getFirstTruePredicateObject(this.algorithms, data).algorithm;
      } catch (err) {
        if (err instanceof _predicateErrors.NoPredicateObjectFoundError) {
          throw new Error("No matched algorithm found");
        }

        throw err;
      }
    }
  }, {
    key: "updateBaselineForModel",
    value: function updateBaselineForModel(newBaselines) {
      return Object.setPrototypeOf(Object.assign({}, this, {
        algorithms: this.algorithms.map(function (_ref) {
          var predicate = _ref.predicate,
              algorithm = _ref.algorithm;
          var newBaselineForCurrentAlgorithm = (0, _undefined.throwErrorIfUndefined)(newBaselines.find(function (_ref2) {
            var predicateData = _ref2.predicateData;
            return predicate.getPredicateResult(predicateData);
          }), new _errors.NoBaselineFoundForAlgorithm(algorithm.name));
          return algorithm.updateBaseline(newBaselineForCurrentAlgorithm.newBaseline);
        })
      }), Model.prototype);
    }
    /**
     * Returns all the fields used in the model and all it's algorithms
     *
     * @returns {DataField[]}
     * @memberof Model
     */

  }, {
    key: "getAllFields",
    value: function getAllFields() {
      return (0, _uniqBy2.default)(this.modelFields.concat((0, _flatten2.default)((0, _flatten2.default)(this.algorithms.map(function (_ref3) {
        var algorithm = _ref3.algorithm;
        return algorithm;
      }).map(function (algorithm) {
        if (algorithm instanceof _coxSurvivalAlgorithm.CoxSurvivalAlgorithm) {
          return (0, _flatten2.default)(algorithm.covariates.map(function (covariate) {
            return covariate.getDescendantFields().concat(covariate);
          }));
        } else if (algorithm instanceof _simpleAlgorithm.SimpleAlgorithm) {
          return algorithm.output.getDescendantFields().concat(algorithm.output);
        } else {
          throw new Error("Unknown algorithm type");
        }
      })))), function (field) {
        return field.name;
      });
    }
  }, {
    key: "getModelRequiredFields",
    value: function getModelRequiredFields() {
      return this.modelFields.filter(function (field) {
        return field.isRequired;
      });
    }
  }, {
    key: "getModelRecommendedFields",
    value: function getModelRecommendedFields() {
      return this.modelFields.filter(function (field) {
        return field.isRecommended;
      });
    }
  }]);

  return Model;
}();

exports.Model = Model;
//# sourceMappingURL=model.js.map