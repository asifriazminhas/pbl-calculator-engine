"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const op_type_1 = require("../../op-type");
const categorical_1 = require("./categorical");
const continuous_1 = require("./continuous");
function addCategoricalOrContinuousFields(field, dataFieldNode) {
    return continuous_1.addContinuousFieldsIfContinuous(categorical_1.addCategoricalFieldsIfCategorical(field, dataFieldNode), dataFieldNode);
}
exports.addCategoricalOrContinuousFields = addCategoricalOrContinuousFields;
function getOpTypeFromPmmlOpType(opType) {
    switch (opType) {
        case 'continuous': {
            return op_type_1.OpType.Continuous;
        }
        case 'categorical': {
            return op_type_1.OpType.Categorical;
        }
        default: {
            throw new Error(`Unknown Pmml OpType ${opType}`);
        }
    }
}
exports.getOpTypeFromPmmlOpType = getOpTypeFromPmmlOpType;
//# sourceMappingURL=op_type.js.map