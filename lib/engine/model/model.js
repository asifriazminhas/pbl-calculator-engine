"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var predicate_1 = require("../predicate/predicate");

var model_algorithm_1 = require("./model-algorithm");

var cox_survival_algorithm_1 = require("../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");

var undefined_1 = require("../../util/undefined");

var errors_1 = require("../errors");

var predicate_errors_1 = require("../predicate/predicate-errors");

var Model =
/*#__PURE__*/
function () {
  function Model(modelJson) {
    _classCallCheck(this, Model);

    this.name = modelJson.name;
    this.algorithms = modelJson.algorithms.map(function (_ref) {
      var algorithm = _ref.algorithm,
          predicate = _ref.predicate;
      return new model_algorithm_1.ModelAlgorithm(new cox_survival_algorithm_1.CoxSurvivalAlgorithm(algorithm), new predicate_1.Predicate(predicate.equation, predicate.variables));
    });
  }

  _createClass(Model, [{
    key: "getAlgorithmForData",
    value: function getAlgorithmForData(data) {
      try {
        return predicate_1.Predicate.getFirstTruePredicateObject(this.algorithms, data).algorithm;
      } catch (err) {
        if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
          throw new Error("No matched algorithm found");
        }

        throw err;
      }
    }
  }, {
    key: "updateBaselineForModel",
    value: function updateBaselineForModel(newBaselines) {
      return Object.setPrototypeOf(Object.assign({}, this, {
        algorithms: this.algorithms.map(function (_ref2) {
          var predicate = _ref2.predicate,
              algorithm = _ref2.algorithm;
          var newBaselineForCurrentAlgorithm = undefined_1.throwErrorIfUndefined(newBaselines.find(function (_ref3) {
            var predicateData = _ref3.predicateData;
            return predicate.getPredicateResult(predicateData);
          }), new errors_1.NoBaselineFoundForAlgorithm(algorithm.name));
          return algorithm.updateBaseline(newBaselineForCurrentAlgorithm.newBaseline);
        })
      }), Model.prototype);
    }
  }]);

  return Model;
}();

exports.Model = Model;
//# sourceMappingURL=model.js.map