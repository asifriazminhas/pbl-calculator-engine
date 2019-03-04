"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SurvivalModelFunctions =
/*#__PURE__*/
function () {
  function SurvivalModelFunctions(model, modelJson) {
    var _this = this;

    _classCallCheck(this, SurvivalModelFunctions);

    this.getRiskToTime = function (data, time) {
      return _this.getAlgorithmForData(data).getRiskToTime(data, time);
    };

    this.getSurvivalToTime = function (data, time) {
      return _this.getAlgorithmForData(data).getSurvivalToTime(data, time);
    };

    this.model = model;
    this.modelJson = modelJson;
  }

  _createClass(SurvivalModelFunctions, [{
    key: "getAlgorithmForData",
    value: function getAlgorithmForData(data) {
      return this.model.getAlgorithmForData(data);
    }
  }, {
    key: "addPredictor",
    value: function addPredictor(newPredictor) {
      return new SurvivalModelFunctions(Object.assign({}, this.model, {
        algorithms: this.model.algorithms.map(function (algorithm) {
          return Object.assign({}, algorithm, {
            algorithms: algorithm.algorithm.addPredictor(newPredictor)
          });
        })
      }), this.modelJson);
    }
  }, {
    key: "reCalibrateOutcome",
    value: function reCalibrateOutcome(calibrationJson) {
      var calibrationJsonToUse; // If the calibrationJson is of type IGenderCalibrationObjects

      if ('male' in calibrationJson) {
        calibrationJsonToUse = [{
          calibrationFactorObjects: calibrationJson.male,
          predicate: {
            equation: "predicateResult = obj[\"sex\"] === \"male\"",
            variables: ['sex']
          }
        }, {
          calibrationFactorObjects: calibrationJson.female,
          predicate: {
            equation: "predicateResult = obj[\"sex\"] === \"male\"",
            variables: ['sex']
          }
        }];
      } else {
        calibrationJsonToUse = calibrationJson;
      }

      if (this.model.algorithms.length === 0) {
        var calibratedModel = Object.assign({}, this.model, {
          algorithm: this.model.algorithms[0].algorithm.addCalibrationToAlgorithm(calibrationJsonToUse, [])
        });
        return new SurvivalModelFunctions(calibratedModel, this.modelJson);
      } else {
        var predicateData = [[{
          name: 'sex',
          coefficent: 'male'
        }], [{
          name: 'sex',
          coefficent: 'female'
        }]];

        var _calibratedModel = Object.assign({}, this.model, {
          algorithms: this.model.algorithms.map(function (_ref) {
            var algorithm = _ref.algorithm,
                predicate = _ref.predicate;
            var predicateDataForCurrentPredicate = predicateData.find(function (currentPredicateData) {
              return predicate.getPredicateResult(currentPredicateData);
            });
            return {
              algorithm: algorithm.addCalibrationToAlgorithm(calibrationJsonToUse, predicateDataForCurrentPredicate),
              predicate: predicate
            };
          })
        });

        return new SurvivalModelFunctions(_calibratedModel, this.modelJson);
      }
    }
  }, {
    key: "getModel",
    value: function getModel() {
      return this.model;
    }
  }, {
    key: "getModelJson",
    value: function getModelJson() {
      return this.modelJson;
    }
  }]);

  return SurvivalModelFunctions;
}();

exports.SurvivalModelFunctions = SurvivalModelFunctions;
//# sourceMappingURL=survival-model-functions.js.map