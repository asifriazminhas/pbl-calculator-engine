"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlgorithmJsonForPredicateData = getAlgorithmJsonForPredicateData;

var _predicate = require("../../engine/predicate/predicate");

function getAlgorithmJsonForPredicateData(modelJson, predicateData) {
  return _predicate.Predicate.getFirstTruePredicateObject(modelJson.algorithms.map(function (algorithm) {
    return Object.assign({}, algorithm, {
      predicate: new _predicate.Predicate(algorithm.predicate.equation, algorithm.predicate.variables)
    });
  }), predicateData).algorithm;
}
//# sourceMappingURL=json-model.js.map