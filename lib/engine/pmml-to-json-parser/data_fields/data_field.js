"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_1 = require("../../field");
const op_type_1 = require("../op_type/op_type");
const extensions_1 = require("../extensions");
function parseDataFieldFromDataFieldPmmlNode(dataFieldNode) {
    return op_type_1.addCategoricalOrContinuousFields({
        name: dataFieldNode.$.name,
        displayName: dataFieldNode.$.displayName,
        extensions: extensions_1.parseExtensions(dataFieldNode),
        fieldType: field_1.FieldType.DataField
    }, dataFieldNode);
}
exports.parseDataFieldFromDataFieldPmmlNode = parseDataFieldFromDataFieldPmmlNode;
//# sourceMappingURL=data_field.js.map