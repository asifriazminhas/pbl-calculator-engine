"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const derived_field_1 = require("./derived_field");
const undefined_1 = require("../../undefined");
const define_function_1 = require("./define-function");
function mergeLocalTransformations(localTransformationsOne, localTransformationsTwo) {
    return {
        DerivedField: derived_field_1.mergeDerivedFields(localTransformationsOne
            ? localTransformationsOne.DerivedField instanceof Array ||
                localTransformationsOne.DerivedField === undefined
                ? undefined_1.returnEmptyArrayIfUndefined(localTransformationsOne.DerivedField)
                : [localTransformationsOne.DerivedField]
            : [], localTransformationsTwo
            ? localTransformationsTwo.DerivedField instanceof Array ||
                localTransformationsTwo.DerivedField === undefined
                ? undefined_1.returnEmptyArrayIfUndefined(localTransformationsTwo.DerivedField)
                : [localTransformationsTwo.DerivedField]
            : []),
        DefineFunction: define_function_1.mergeDefineFunctions(localTransformationsOne
            ? undefined_1.returnEmptyArrayIfUndefined(localTransformationsOne.DefineFunction)
            : [], localTransformationsTwo
            ? undefined_1.returnEmptyArrayIfUndefined(localTransformationsTwo.DefineFunction)
            : []),
    };
}
exports.mergeLocalTransformations = mergeLocalTransformations;
//# sourceMappingURL=local_transformations.js.map