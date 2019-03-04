"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var predicate_1 = require("../../engine/predicate/predicate");

function getAlgorithmJsonForPredicateData(modelJson, predicateData) {
  return predicate_1.Predicate.getFirstTruePredicateObject(modelJson.algorithms.map(function (algorithm) {
    return Object.assign({}, algorithm, {
      predicate: new predicate_1.Predicate(algorithm.predicate.equation, algorithm.predicate.variables)
    });
  }), predicateData).algorithm;
}

exports.getAlgorithmJsonForPredicateData = getAlgorithmJsonForPredicateData;
//# sourceMappingURL=json-model.js.map