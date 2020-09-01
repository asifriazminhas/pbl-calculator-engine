"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelFactory = void 0;

var _model = require("../model/model");

var _modelAlgorithm = require("../model/model-algorithm");

var _coxSurvivalAlgoritm = require("./cox-survival-algoritm");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Contains methods to create new Model objects
var ModelFactory = /*#__PURE__*/function () {
  function ModelFactory() {
    _classCallCheck(this, ModelFactory);
  }

  _createClass(ModelFactory, null, [{
    key: "extendModel",

    /**
     * Used to extend a model object at runtime for eg. to add new methods and
     * properties to it
     *
     * @static
     * @template U
     * @param {Model} model The Model object to extend
     * @param {U[]} newCoxProperties properties that will be added to the
     * algorithms within the model. Each entry in the array will be used to
     * extend the algorithm at the same entry in the model
     * @returns {(Model<U & CoxSurvivalAlgorithm>)}
     * @memberof ModelFactory
     */
    value: function extendModel(model, newModelProperties, newCoxProperties) {
      var modelAlgorithms = model.algorithms.map(function (modelAlgorithm, index) {
        if (newCoxProperties) {
          return Object.setPrototypeOf(Object.assign({}, modelAlgorithm, {
            algorithm: _coxSurvivalAlgoritm.CoxFactory.extendCox(modelAlgorithm.algorithm, newCoxProperties[index])
          }), _modelAlgorithm.ModelAlgorithm.prototype);
        } else {
          return modelAlgorithm;
        }
      });
      return Object.setPrototypeOf(Object.assign({}, model, newModelProperties, {
        algorithms: modelAlgorithms
      }), _model.Model.prototype);
    }
  }]);

  return ModelFactory;
}();

exports.ModelFactory = ModelFactory;
//# sourceMappingURL=model-factory.js.map