"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeLocalTransformations = mergeLocalTransformations;

var _derived_field = require("./derived_field");

var _undefined = require("../../../util/undefined");

var _defineFunction = require("./define-function");

function mergeLocalTransformations(localTransformationsOne, localTransformationsTwo) {
  return {
    DerivedField: (0, _derived_field.mergeDerivedFields)(localTransformationsOne ? localTransformationsOne.DerivedField instanceof Array || localTransformationsOne.DerivedField === undefined ? (0, _undefined.returnEmptyArrayIfUndefined)(localTransformationsOne.DerivedField) : [localTransformationsOne.DerivedField] : [], localTransformationsTwo ? localTransformationsTwo.DerivedField instanceof Array || localTransformationsTwo.DerivedField === undefined ? (0, _undefined.returnEmptyArrayIfUndefined)(localTransformationsTwo.DerivedField) : [localTransformationsTwo.DerivedField] : []),
    DefineFunction: (0, _defineFunction.mergeDefineFunctions)(localTransformationsOne ? (0, _undefined.returnEmptyArrayIfUndefined)(localTransformationsOne.DefineFunction) : [], localTransformationsTwo ? (0, _undefined.returnEmptyArrayIfUndefined)(localTransformationsTwo.DefineFunction) : [])
  };
}
//# sourceMappingURL=local_transformations.js.map