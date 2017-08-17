"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const op_types_1 = require("../../common/op-types");
const categorical_1 = require("./categorical");
const continuous_1 = require("./continuous");
function addCategoricalOrContinuousFields(field, dataFieldNode) {
    return continuous_1.addContinuousFieldsIfContinuous(categorical_1.addCategoricalFieldsIfCategorical(field, dataFieldNode), dataFieldNode);
}
exports.addCategoricalOrContinuousFields = addCategoricalOrContinuousFields;
function getOpTypeFromPmmlOpType(opType) {
    switch (opType) {
        case 'continuous': {
            return op_types_1.OpTypes.Continuous;
        }
        case 'categorical': {
            return op_types_1.OpTypes.Categorical;
        }
        default: {
            throw new Error(`Unknown Pmml OpType ${opType}`);
        }
    }
}
exports.getOpTypeFromPmmlOpType = getOpTypeFromPmmlOpType;
//# sourceMappingURL=op_type.js.map