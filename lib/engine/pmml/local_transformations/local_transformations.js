"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const derived_field_1 = require("./derived_field");
const undefined_1 = require("../../common/undefined");
function mergeLocalTransformations(localTransformationsOne, localTransformationsTwo) {
    return {
        DerivedField: derived_field_1.mergeDerivedFields(localTransformationsOne ? undefined_1.returnEmptyArrayIfUndefined(localTransformationsOne.DerivedField) : [], localTransformationsTwo ? undefined_1.returnEmptyArrayIfUndefined(localTransformationsTwo.DerivedField) : [])
    };
}
exports.mergeLocalTransformations = mergeLocalTransformations;
//# sourceMappingURL=local_transformations.js.map